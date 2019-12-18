import { MapDialogComponent } from '../map-dialog/map-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewLocationService } from 'src/app/services/new-location.service';
import { Component, Input, OnInit, EventEmitter, Output, ChangeDetectorRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import { IGeolocation } from 'src/app/models/geolocation.model';
import { Map, Layer, latLng, latLngBounds, imageOverlay, CRS, tileLayer, divIcon, marker, LatLngBounds, geoJSON, Point, Marker} from 'leaflet';
import { GeoJsonObject } from 'geojson';
import { ILocation } from 'src/app/models/g-location.model';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { Subject, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { findLocationById } from 'src/app/shared/utils';
import { isNullOrUndefined } from 'util';
import { MatDialog } from '@angular/material/dialog';
import { MapPopupComponent } from './popup/popup.component';
import { IAsset } from 'src/app/models/g-asset.model';
import {MAP_TILES_URL_ACTIVE} from 'src/app/shared/global';

@Component({
  selector: 'pxs-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {

  @Input() height;
  @Input() rootLocation: ILocation;
  @Input() selectedLocation: ILocation;
  @Input() customAssetService;
  @Input() displayAssets = true;
  @Input() assetUrl = '/private/smartmonitoring/detail/';
  @Input() leafUrl: string;

  @Output() changeLocation: EventEmitter<ILocation> = new EventEmitter<ILocation>();

  private subscriptions: Subscription[] = [];

  currentMap: Map;
  center: IGeolocation;
  options: any;
  markers: Layer[] = [];
  locationsLayer: Layer[] = [];
  imageBounds: LatLngBounds;
  bounds: LatLngBounds;
  markerClusterOptions: any;

  public assetsRequestSource = new Subject();
  public assets: IAsset[];


  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public newAssetService: NewAssetService,
    public newLocationService: NewLocationService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.assetFilter) {
      if (changes.assetFilter.currentValue !== changes.assetFilter.previousValue) {
        this.populateMarkersWithAssets();
      }
    }
  }

  public ngOnInit() {

    const assetsRequestSourcePipe = this.assetsRequestSource.pipe(
      switchMap(req => {
        if (!this.displayAssets) {
          console.log('displayAssets is false');
          return of([]);
        }
        if (req === 'STOP') {
          return of(this.assets);
        }
        if (isNullOrUndefined(this.selectedLocation.id)) {
          return of([]);
        } else {
          // TODO: reach only asset with the filter?
          return this.getAssetsByLocation();
        }
      })
    );

    this.subscriptions.push(assetsRequestSourcePipe.subscribe(
      (data: IAsset[]) => {
        this.markers = [];
        this.assets = data;
        this.populateMarkersWithAssets();
      })
    );

    // By default, center with Proximus location
    this.center = {
      lat: 50.860180,
      lng: 4.358606
    };

    this.markerClusterOptions = {
      iconCreateFunction(cluster) {
        const childCount = cluster.getChildCount();
        let c = ' marker-cluster-';

        if (childCount < 10) {
          c += 'small';
        } else if (childCount < 100) {
          c += 'medium';
        } else {
          c += 'large';
        }

        return divIcon({ html: '<div><span>' + childCount + '</span></div>',
         className: 'marker-cluster' + c, iconSize: new Point(40, 40) });
        }
    };

    if (this.rootLocation) {
      this.checkIfSelectedLocation();
    } else {
      this.subscriptions.push(
        this.newLocationService.getLocationsTree().subscribe((locations: ILocation[]) => {
          this.rootLocation = {
            id: null,
            parentId: null,
            geolocation: null,
            image: null,
            name: 'Locations',
            description: null,
            children: locations,
          };
          this.checkIfSelectedLocation();
        })
      );
    }
  }

  public getAssetsByLocation() {
    if (this.customAssetService) {
      return this.customAssetService.getAssetsByLocationId(this.selectedLocation.id);
    } else {
      return this.newAssetService.getAssetsByLocationId(this.selectedLocation.id);
    }
  }

  private checkIfSelectedLocation() {
    if (this.selectedLocation && !isNullOrUndefined(this.selectedLocation.id)) {
      const selectedLocation = {...this.selectedLocation};
      this.selectedLocation = this.rootLocation;
      const { path } = findLocationById(this.rootLocation, selectedLocation.id);
      for (const location of path) {
        this.goToChild(location, false);
      }
    }
    this.initMap();
  }

  public populateMarkersWithAssets() {
    this.markers = [];
    const assetWithoutPosition: IAsset[] = [];

    if (this.assets && this.assets.length) {
      for (const asset of this.assets) {
        if (asset.geolocation) {
          const that = this;
          const assetIcon = this.generateAssetMarker(asset);
          const newMarker = marker(
            [asset.geolocation.lat, asset.geolocation.lng],
            {
              icon: assetIcon
            }
          ).bindPopup(() => this.createAssetPopup(asset, this.assetUrl, newMarker));
          newMarker.on('mouseover', function() {
            this.openPopup();
          });
          this.markers.push(newMarker);
        } else {
          assetWithoutPosition.push(asset);
        }
      }
    }

    if (assetWithoutPosition.length > 0) {
      this.snackBar.open(`${assetWithoutPosition.length} asset(s) without position`, 'See', {
        duration: 3000
      }).onAction().subscribe(() => {
          this.dialog.open(MapDialogComponent, {
            width: '300px',
            data: {
              assets: assetWithoutPosition,
              assetUrl: this.assetUrl
            }
          });
      });
    }

    if (!this.imageBounds) {
      this.setBounds();
      this.fitBoundsAndZoom();
    }
  }

  public generateAssetMarker(asset: IAsset = {}) {
    return divIcon({
        className: 'map-marker-asset',
        iconSize: null,
        html: '<div><span class="pxi-map-marker"></span></div>'
    });
  }

  private populateMarkersWithchildren() {
    this.locationsLayer = [];
    const locationIcon = divIcon({
      className: 'map-marker-location',
      iconSize: null,
      html: '<div><span class="pxi-map-hotspot"></span></div>'
    });

    this.selectedLocation = this.selectedLocation ? this.selectedLocation : this.rootLocation;
    const children = this.selectedLocation.children;
    if (children && children.length) {
      for (const child of children) {
        child.parent = this.selectedLocation;
        const newMarker = marker(
          [child.geolocation.lat, child.geolocation.lng],
          {
            icon: locationIcon
          }
        ).bindPopup(() => this.createLocationPopup(child, this.leafUrl, newMarker));
        newMarker.on('mouseover', function() {
          this.openPopup();
        });
        this.locationsLayer.push(newMarker);
      }
    }
  }

  private initMap() {
    this.populateMarkersWithchildren();
    this.imageBounds = null;
    const floorPlan = (this.selectedLocation) ? this.selectedLocation.image : null;
    if (floorPlan) {
      const image: HTMLImageElement = new Image();
      image.src = floorPlan;
      image.onload = () => {
        const { width, height } = image;
        const ratioW = height / width;
        const ratioH = width / height;
        this.imageBounds = latLngBounds([0, 0], [(image.width / 100) * ratioW, (image.height / 100) * ratioH]);
        const imageMap = imageOverlay(floorPlan, this.imageBounds);
        this.options = {
          crs: CRS.Simple,
          layers: [imageMap],
          zoom: 1,
          maxZoom: 12,
        };
        this.changeDetectorRef.detectChanges();
      };
    } else {
      this.setBounds();
      this.options = {
        layers: tileLayer(MAP_TILES_URL_ACTIVE),
        zoom: 12,
        center: latLng(this.center.lat, this.center.lng),
        // tslint:disable-next-line: max-line-length
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
      };
    }
  }

  private setBounds(assets = this.assets, location = this.selectedLocation) {
    const geoJsonData = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[]]
      }
    };

    if (assets) {
      this.addAssetBounds(geoJsonData, assets);
    }

    if (location) {
      this.addLocationsBounds(geoJsonData, location);
    }

    const geoJsonLayer = geoJSON(geoJsonData as GeoJsonObject);
    this.bounds = geoJsonLayer.getBounds();
  }

  private addAssetBounds(geoJsonData, assets) {
    if (assets && assets.length) {
      assets.forEach(asset => {
        if (asset.geolocation) {
          const {lng, lat} = asset.geolocation;
          geoJsonData.geometry.coordinates[0].push([lng, lat]);
        }
      });
    }
  }

  private addLocationsBounds(geoJsonData, location) {
    if (location) {
      const children = location.children;
      if (children && children.length) {
        children.forEach(child => {
          const {lng, lat} = child.geolocation;
          geoJsonData.geometry.coordinates[0].push([lng, lat]);
        });
      }
    }
  }

  public createAssetPopup(asset: IAsset, assetUrl: string, marker: Marker) {
    const popupEl: NgElement & WithProperties<MapPopupComponent> = document.createElement('map-popup-element') as any;
    popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
    popupEl.asset = asset;
    popupEl.assetUrl = assetUrl;
    popupEl.marker = marker;
    document.body.appendChild(popupEl);
    return popupEl;
  }

  public createLocationPopup(location: ILocation, leafUrl: string = null, marker: Marker) {
    const popupEl: NgElement & WithProperties<MapPopupComponent> = document.createElement('map-popup-element') as any;
    popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
    popupEl.goToChild = (location) => { this.goToChild(location, true); };
    popupEl.location = location;
    popupEl.leafUrl = leafUrl;
    popupEl.marker = marker;
    document.body.appendChild(popupEl);
    return popupEl;
  }

  public goToChild(location: ILocation, initMap = false) {
    const parent = {...this.selectedLocation};
    location.parent = parent;
    this.options = null;
    this.changeDetectorRef.detectChanges();
    this.selectedLocation = location;
    this.changeLocation.emit(location);
    if (initMap) {
      this.initMap();
    }
  }

  public goToParentLocation(location: ILocation) {
    this.options = null;
    this.changeDetectorRef.detectChanges();
    this.selectedLocation = location;
    this.changeLocation.emit(location);
    this.initMap();
  }

  public getAssetsBySelectedLocation() {
    if (this.selectedLocation.assets && this.selectedLocation.assets.length) {
      this.assets = this.selectedLocation.assets;
      this.assetsRequestSource.next('STOP');
      this.populateMarkersWithAssets();
    } else {
      this.markers = [];
      this.assets = [];
      this.assetsRequestSource.next();
    }
  }

  public fitBoundsAndZoom() {
    if (this.bounds.isValid()) {
      this.currentMap.fitBounds(this.bounds);
      setTimeout(() => {
        const currentZoom = this.currentMap.getZoom();
        this.currentMap.setZoom(currentZoom - 0.75);
      }, 0);
    }
  }

  public onMapReady(map: Map) {
    this.currentMap = map;
    this.getAssetsBySelectedLocation();

    if (this.imageBounds) {
      this.currentMap.fitBounds(this.imageBounds);
      this.currentMap.setMaxBounds(this.imageBounds);
    } else if (this.bounds) {
      if (this.bounds.getNorthEast() && this.bounds.getSouthWest()) {
        this.fitBoundsAndZoom();
      } else {
        const parent = this.selectedLocation.parent;
        if (parent) {
          if (parent.geolocation) {
            const {lat, lng} = this.selectedLocation.parent.geolocation;
            this.currentMap.panTo({lng, lat});
            this.currentMap.setZoom(12);
          } else {
            this.setBounds(null, this.selectedLocation.parent);
            this.fitBoundsAndZoom();
          }
        }
      }
    }
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
