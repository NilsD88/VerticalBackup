import { SharedService } from './../../../../../src/app/services/shared.service';
import { SubSink } from 'subsink';
import { MapDialogComponent } from '../map-dialog/map-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocationService } from 'src/app/services/location.service';
import { Component, Input, OnInit, EventEmitter, Output, ChangeDetectorRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import { IGeolocation } from 'src/app/models/geolocation.model';
import { Map, Layer, latLng, latLngBounds, imageOverlay, CRS, tileLayer, divIcon, marker, LatLngBounds, geoJSON, Point, Marker} from 'leaflet';
import { GeoJsonObject } from 'geojson';
import { ILocation } from 'src/app/models/location.model';
import { AssetService } from 'src/app/services/asset.service';
import { Subject, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { findLocationById } from 'src/app/shared/utils';
import { isNullOrUndefined } from 'util';
import { MatDialog } from '@angular/material/dialog';
import { MapPopupComponent } from './popup/popup.component';
import { IAsset } from 'src/app/models/asset.model';
import {MAP_TILES_URL_ACTIVE, UNKNOWN_PARENT_ID, DEFAULT_LOCATION} from 'src/app/shared/global';



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
  @Input() assetUrl = '/private/smart-monitoring/detail/';
  @Input() leafUrl: string;

  @Output() changeLocation: EventEmitter<ILocation> = new EventEmitter<ILocation>();

  private subs = new SubSink();

  currentMap: Map;
  center: IGeolocation;
  options: any;
  markers: Layer[] = [];
  locationsLayer: Layer[] = [];
  imageBounds: LatLngBounds;
  bounds: LatLngBounds;
  markerClusterOptions: any;
  floorplan: string;

  public assetsRequestSource = new Subject();
  public assets: IAsset[];
  public UNKNOWN_PARENT_ID = UNKNOWN_PARENT_ID;


  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public assetService: AssetService,
    public locationService: LocationService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    protected sharedService: SharedService
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.assetFilter) {
      if (changes.assetFilter.currentValue !== changes.assetFilter.previousValue) {
        this.populateAssets();
      }
    }
  }

  public async ngOnInit() {

    this.center = DEFAULT_LOCATION;
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
      await this.checkIfSelectedLocation();
    } else {
      const locations: ILocation[] = await this.locationService.getLocationsTree().toPromise();
      if (this.sharedService.user.hasRole('pxs:iot:location_admin')) {
        this.rootLocation = locations[0];
      } else {
        this.rootLocation = {
          id: null,
          parentId: null,
          geolocation: null,
          image: null,
          name: 'Locations',
          description: null,
          children: locations,
        };
      }
      await this.checkIfSelectedLocation();
    }

    const assetsRequestSourcePipe = this.assetsRequestSource.pipe(
      switchMap(req => {
        if (!this.displayAssets) {
          return of([]);
        }
        if (req === 'STOP') {
          return of(this.assets);
        }
        if (isNullOrUndefined(this.selectedLocation.id)) {
          return of([]);
        } else {
          // TODO: reach only asset with the filter? (asset name, location name)
          return this.getAssetsByLocation();
        }
      })
    );

    this.subs.add(
      assetsRequestSourcePipe.subscribe(
        (data: IAsset[]) => {
          this.markers = [];
          this.assets = data;
          this.populateAssets();
        }
      )
    );
  }

  public getAssetsByLocation() {
    if (this.customAssetService) {
      return this.customAssetService.getAssetsByLocationId(this.selectedLocation.id);
    } else {
      return this.assetService.getAssetsByLocationId(this.selectedLocation.id);
    }
  }

  private async checkIfSelectedLocation() {
    if (this.selectedLocation && !isNullOrUndefined(this.selectedLocation.id)) {
      const selectedLocation = {...this.selectedLocation};
      this.selectedLocation = this.rootLocation;
      const { path } = findLocationById(this.rootLocation, selectedLocation.id);
      for (const location of path) {
        await this.goToChild(location, false);
      }
    }
    return await this.initMap();
  }

  public populateAssets() {
    setTimeout(() => {
      this.markers = [];
      const assetWithoutPosition: IAsset[] = [];

      if (this.assets && this.assets.length) {
        for (const asset of this.assets) {
          if (asset.geolocation) {
            const assetIcon = generateAssetIcon(asset);
            const newMarker = marker(
              [asset.geolocation.lat, asset.geolocation.lng],
              {
                icon: assetIcon
              }
            ).bindPopup(() => this.createAssetPopup(asset, this.assetUrl, newMarker));
            newMarker.on('mouseover', function() {
              this.openPopup();
            });
            newMarker['asset'] = asset;
            this.markers.push(newMarker);
          } else {
            assetWithoutPosition.push(asset);
          }
        }
      }

      if (assetWithoutPosition.length > 0) {
        this.snackBar.open(
          `${assetWithoutPosition.length} ${this.sharedService.translate.instant('NOTIFS.ASSETS_WITHOUT_POSITION')}`,
          this.sharedService.translate.instant('GENERAL.SEE'),
          {
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
    }, 0);
  }


  protected populateLocations() {
    this.locationsLayer = [];
    this.selectedLocation = this.selectedLocation ? this.selectedLocation : this.rootLocation;

    const children = this.selectedLocation.children;
    if (children && children.length) {
      for (const child of children) {
        child.parent = this.selectedLocation;
        console.log(child);
        const newMarker = marker(
          [child.geolocation.lat, child.geolocation.lng],
          {
            icon: generateLocationIcon(child.module)
          }
        ).bindPopup(() => this.createLocationPopup(child, this.leafUrl, newMarker));
        newMarker.on('mouseover', function() {
          this.openPopup();
        });
        this.locationsLayer.push(newMarker);
      }
    }
  }

  private async initMap(): Promise<boolean> {

    this.assetsRequestSource.next('STOP');
    this.imageBounds = null;
    this.floorplan = null;

    if (this.selectedLocation && !isNullOrUndefined(this.selectedLocation.id)) {
      this.floorplan = await this.locationService.getFloorplanOfLocationById(this.selectedLocation.id).toPromise();
    }

    if (this.floorplan) {
      const image: HTMLImageElement = new Image();
      image.src = this.floorplan;
      image.onload = () => {
        const { width, height } = image;
        const ratioW = height / width;
        const ratioH = width / height;
        this.imageBounds = latLngBounds([0, 0], [(image.width / 100) * ratioW, (image.height / 100) * ratioH]);
        const imageMap = imageOverlay(this.floorplan, this.imageBounds);
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

    this.populateLocations();
    return true;
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

  public async goToChild(location: ILocation, initMap = false) {
    const parent = {...this.selectedLocation};
    location.parent = parent;
    this.options = null;
    this.changeDetectorRef.detectChanges();
    this.selectedLocation = location;
    this.changeLocation.emit(location);
    if (initMap) {
      await this.initMap();
    }
  }

  public async goToParentLocation(location: ILocation) {
    this.options = null;
    this.changeDetectorRef.detectChanges();
    this.selectedLocation = location;
    this.changeLocation.emit(location);
    await this.initMap();
  }

  public getAssetsBySelectedLocation() {
    if (this.selectedLocation.assets && this.selectedLocation.assets.length) {
      this.assets = this.selectedLocation.assets;
      this.assetsRequestSource.next('STOP');
      this.populateAssets();
    } else {
      this.markers = [];
      this.assets = [];
      this.assetsRequestSource.next();
    }
  }

  public fitBoundsAndZoom() {
    if (!this.currentMap) {
      return;
    }

    if (this.bounds && this.bounds.isValid()) {
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
    this.subs.unsubscribe();
  }
}


function generateAssetIcon(asset: IAsset = {}) {
  return divIcon({
      className: 'map-marker-asset',
      iconSize: null,
      html: '<div><span class="pxi-map-marker"></span></div>'
  });
}

function generateLocationIcon(moduleName: string = null) {
  switch (moduleName) {
    case 'PEOPLE_COUNTING_STAIRWAY_2_HEALTH': {
      return divIcon({
        className: 'map-marker-location',
        iconSize: null,
        html: '<div><span class="pxi-building-circle"></span></div>'
      });
    }
    case 'PEOPLE_COUNTING_SMART_COUNTING': {
      return divIcon({
        className: 'map-marker-location',
        iconSize: null,
        html: '<div><span class="pxi-building-circle"></span></div>'
      });
    }
    case 'PEOPLE_COUNTING_WALKING_TRAILS': {
      return divIcon({
        className: 'map-marker-location',
        iconSize: null,
        html: '<div><span class="pxi-map-arrows"></span></div>'
      });
    }
    default: {
      return divIcon({
        className: 'map-marker-location',
        iconSize: null,
        html: '<div><span class="pxi-map-hotspot"></span></div>'
      });
    }
  }
}