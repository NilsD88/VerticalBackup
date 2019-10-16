import { MapDialogComponent } from './map-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewLocationService } from './../../../../../src/app/services/new-location.service';
import { Component, Input, OnInit, EventEmitter, Output, ChangeDetectorRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import { IGeolocation } from 'src/app/models/asset.model';
import { Map, Layer, latLng, latLngBounds, imageOverlay, CRS, tileLayer, divIcon, marker, LatLngBounds, geoJSON, Point} from 'leaflet';
import { GeoJsonObject } from 'geojson';
import { ILocation } from 'src/app/models/g-location.model';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { Subject, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { findLocationById } from 'src/app/shared/utils';
import { isNullOrUndefined } from 'util';
import { MatDialog } from '@angular/material/dialog';
import { MapPopupComponent } from '../map-popup/map-popup.component';
import { generateAssetIcon } from './assetIcon';
import { IAsset } from 'src/app/models/g-asset.model';

@Component({
  selector: 'pxs-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {

  @Input() height;
  @Input() rootLocation: ILocation;
  @Input() selectedLocation: ILocation;
  @Input() mode: string;
  @Input() assetFilter: {property: string; values: string[]};

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

  private assetsRequestSource = new Subject();
  public assets: IAsset[];


  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private newAssetService: NewAssetService,
    private newLocationService: NewLocationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.assetFilter) {
      if (changes.assetFilter.currentValue !== changes.assetFilter.previousValue) {
        this.populateMarkersWithAssets();
      }
    }
  }

  ngOnInit() {

    const assetsRequestSourcePipe = this.assetsRequestSource.pipe(
      switchMap(req => {
        if (req === 'STOP') {
          return of(this.assets);
        }
        if (isNullOrUndefined(this.selectedLocation.id)) {
          return of([]);
        } else {
          // TODO: reach only asset with the filter?
          // return this.newAssetService.getAssetsByLocationId(this.selectedLocation.id, this.assetFilter);
          return this.newAssetService.getAssetsByLocationId(this.selectedLocation.id);
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

  private checkIfSelectedLocation() {
    if (this.selectedLocation && !isNullOrUndefined(this.selectedLocation.id)) {
      const selectedLocation = {...this.selectedLocation};
      this.selectedLocation = this.rootLocation;
      const { path } = findLocationById(this.rootLocation, selectedLocation.id);
      for (const location of path) {
        this.goToChild(location);
      }
      // this.getAssetsBySelectedLocation();
    } else {
      this.initMap();
    }
  }

  private populateMarkersWithAssets() {
    const mode = this.mode;
    this.markers = [];
    const assetWithoutPosition: IAsset[] = [];

    if (this.assets && this.assets.length) {
      for (const asset of this.assets) {
        if (this.assetFilter) {
          const properties: string[] = this.assetFilter.property.split('.');
          let valueOfProperty = asset;
          for (const property of properties) {
            if (valueOfProperty[property]) {
              valueOfProperty = valueOfProperty[property];
            } else {
              valueOfProperty = null;
              break;
            }
          }
          // @ts-ignore: Unreachable code error
          if (valueOfProperty && !this.assetFilter.values.some((value) => valueOfProperty === value)) {
            continue;
          }
        }
        if (asset.geolocation) {
          const assetIcon = generateAssetIcon(mode, asset);
          const newMarker = marker(
            [asset.geolocation.lat, asset.geolocation.lng],
            {
              icon: assetIcon
            }
          ).bindPopup(() => this.createAssetPopup(asset)).openPopup();
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
              assets: assetWithoutPosition
            }
          });
      });
    }

    if (!this.imageBounds) {
      this.setBounds();
      this.fitBoundsAndZoom();
    }
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
        ).bindPopup(() => this.createLocationPopup(child)).openPopup();
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
        // tslint:disable-next-line: max-line-length
        layers: tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoibmljb2xhc2FuY2VsIiwiYSI6ImNqeHZ4ejg0ZjAzeGIzcW1vazI0MHJia3MifQ.METba-D_-BOMeRbRnwDkFw'),
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

  public createAssetPopup(asset: IAsset) {
    const popupEl: NgElement & WithProperties<MapPopupComponent> = document.createElement('map-popup-element') as any;
    popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
    popupEl.asset = asset;
    document.body.appendChild(popupEl);
    return popupEl;
  }

  public createLocationPopup(location: ILocation) {
    const popupEl: NgElement & WithProperties<MapPopupComponent> = document.createElement('map-popup-element') as any;
    popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
    popupEl.goToChild = (location) => { this.goToChild(location); };
    popupEl.location = location;
    document.body.appendChild(popupEl);
    return popupEl;
  }

  goToChild(location: ILocation) {
    const parent = {...this.selectedLocation};
    location.parent = parent;
    this.options = null;
    this.changeDetectorRef.detectChanges();
    this.selectedLocation = location;
    this.changeLocation.emit(location);
    this.initMap();
  }

  goToParentLocation(location: ILocation) {
    this.options = null;
    this.changeDetectorRef.detectChanges();
    this.selectedLocation = location;
    this.changeLocation.emit(location);
    this.initMap();
  }

  getAssetsBySelectedLocation() {
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

  fitBoundsAndZoom() {
    this.currentMap.fitBounds(this.bounds);
    setTimeout(() => {
      const currentZoom = this.currentMap.getZoom();
      this.currentMap.setZoom(currentZoom - 0.75);
    }, 0);
  }

  onMapReady(map: Map) {
    this.currentMap = map;
    this.getAssetsBySelectedLocation();

    if (this.imageBounds) {
      console.log('imageBounds', this.imageBounds);
      this.currentMap.fitBounds(this.imageBounds);
      this.currentMap.setMaxBounds(this.imageBounds);
    } else if (this.bounds) {
      console.log('bounds');
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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
