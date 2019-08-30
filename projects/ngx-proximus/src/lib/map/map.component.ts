import { NewLocationService } from './../../../../../src/app/services/new-location.service';
import {Component, Input, OnInit, EventEmitter, Output, ChangeDetectorRef} from '@angular/core';
import {NgElement, WithProperties} from '@angular/elements';
import {Asset, IAsset, IGeolocation} from 'src/app/models/asset.model';
import {Map, Layer, latLng, latLngBounds, imageOverlay, CRS, tileLayer, divIcon, marker, icon, LatLngBounds, geoJSON, MarkerCluster, Point} from 'leaflet';
import { GeoJsonObject } from 'geojson';
import { INewLocation } from 'src/app/models/new-location';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NewAsset, INewAsset } from 'src/app/models/new-asset.model';
import { MapPopupComponent } from '../map-popup/map-popup.component';
import { findLocationById } from 'src/app/shared/utils';

@Component({
  selector: 'pxs-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() height;
  @Input() rootLocation: INewLocation;
  @Input() selectedLocation: INewLocation;

  @Output() changeLocation: EventEmitter<INewLocation> = new EventEmitter<INewLocation>();


  currentMap: Map;
  center: IGeolocation;
  options: any;
  markers: Layer[] = [];
  locationsLayer: Layer[] = [];
  imageBounds: LatLngBounds;
  bounds: LatLngBounds;

  markerClusterOptions: any;


  private assetsRequestSource = new Subject();
  public assets: INewAsset[];


  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private newAssetService: NewAssetService,
    private newLocationService: NewLocationService) {}

  ngOnInit() {

    this.assetsRequestSource.pipe(
      switchMap(req => this.newAssetService.getAssetsByLocationId(+this.selectedLocation.id))
    ).subscribe((data: NewAsset[]) => {
      this.markers = [];
      this.assets = data;
      this.populateMarkersWithAssets();
    });

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
      this.newLocationService.getLocations().subscribe((locations: INewLocation[]) => {
        this.rootLocation = {
          id: null,
          parentId: null,
          locationType: null,
          geolocation: null,
          floorPlan: null,
          name: 'Locations',
          sublocationsId: null,
          sublocations: locations,
        };
        this.checkIfSelectedLocation();
      });
    }
  }

  private checkIfSelectedLocation() {
    if (this.selectedLocation && this.selectedLocation.id) {
      const selectedLocation = {...this.selectedLocation};
      this.selectedLocation = this.rootLocation;
      const { path } = findLocationById(this.rootLocation, +selectedLocation.id);
      for (const location of path) {
        this.goToSublocation(location);
      }
      this.getAssetsBySelectedLocation();
    } else {
      this.initMap();
    }
  }

  private populateMarkersWithAssets() {
    const assetIcon = divIcon({
      className: 'map-marker-asset',
      iconSize: null,
      html: '<div><span class="pxi-map-marker"></span></div>'
    });

    if (this.assets && this.assets.length) {
      for (const asset of this.assets) {
        if (asset.geolocation) {
          const newMarker = marker(
            [asset.geolocation.lat, asset.geolocation.lng],
            {
              icon: assetIcon
            }
          ).bindPopup(() => this.createAssetPopup(asset)).openPopup();
          this.markers.push(newMarker);
        }
      }
    }
  }

  private initMap() {

    this.locationsLayer = [];
    this.imageBounds = null;

    const locationIcon = divIcon({
      className: 'map-marker-location',
      iconSize: null,
      html: '<div><span class="pxi-map-hotspot"></span></div>'
    });

    this.selectedLocation = this.selectedLocation ? this.selectedLocation : this.rootLocation;
    const sublocations = this.selectedLocation.sublocations;
    if (sublocations && sublocations.length) {
      for (const sublocation of sublocations) {
        sublocation.parent = this.selectedLocation;
        const newMarker = marker(
          [sublocation.geolocation.lat, sublocation.geolocation.lng],
          {
            icon: locationIcon
          }
        ).bindPopup(() => this.createLocationPopup(sublocation)).openPopup();
        this.locationsLayer.push(newMarker);
      }
    }

    const floorPlan = (this.selectedLocation) ? this.selectedLocation.floorPlan : null ;
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
      const sublocations = location.sublocations;
      if (sublocations && sublocations.length) {
        sublocations.forEach(sublocation => {
          const {lng, lat} = sublocation.geolocation;
          geoJsonData.geometry.coordinates[0].push([lng, lat]);
        });
      }
    }
  }





  public createAssetPopup(asset: INewAsset) {
    const popupEl: NgElement & WithProperties<MapPopupComponent> = document.createElement('map-popup-element') as any;
    popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
    popupEl.asset = asset;
    document.body.appendChild(popupEl);
    return popupEl;
  }

  public createLocationPopup(location: INewLocation) {
    const popupEl: NgElement & WithProperties<MapPopupComponent> = document.createElement('map-popup-element') as any;
    popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
    popupEl.goToSublocation = (location) => { this.goToSublocation(location); };
    popupEl.location = location;
    document.body.appendChild(popupEl);
    return popupEl;
  }

  goToSublocation(location: INewLocation) {
    const parent = {...this.selectedLocation};
    location.parent = parent;
    this.options = null;
    this.changeDetectorRef.detectChanges();
    this.selectedLocation = location;
    this.changeLocation.emit(location);
    this.getAssetsBySelectedLocation();
    this.initMap();
  }

  goToParentLocation(location: INewLocation) {
    this.options = null;
    this.changeDetectorRef.detectChanges();
    this.selectedLocation = location;
    this.changeLocation.emit(location);
    this.getAssetsBySelectedLocation();
    this.initMap();
  }

  getAssetsBySelectedLocation() {
    if (this.selectedLocation.assets && this.selectedLocation.assets.length) {
      this.markers = [];
      this.assets = this.selectedLocation.assets;
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
            this.currentMap.panTo({lat, lng});
            this.currentMap.setZoom(12);
          } else {
            this.setBounds(null, this.selectedLocation.parent);
            this.fitBoundsAndZoom();
          }
        }
      }
    }
  }
}