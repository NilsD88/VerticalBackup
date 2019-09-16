import {Component, Input, OnInit, EventEmitter, Output, ChangeDetectorRef} from '@angular/core';
import {NgElement, WithProperties} from '@angular/elements';
import {Asset, IAsset, IGeolocation} from 'src/app/models/asset.model';
import {Map, Layer, latLng, latLngBounds, imageOverlay, CRS, tileLayer, divIcon, marker, icon, LatLngBounds, geoJSON, MarkerCluster, Point} from 'leaflet';
import {MapAssetPopupComponent} from '../map-asset-popup/map-asset-popup.component';
import { GeoJsonObject } from 'geojson';
import { INewLocation } from 'src/app/models/new-location';

@Component({
  selector: 'pxs-map-asset2',
  templateUrl: './map-asset2.component.html',
  styleUrls: ['./map-asset2.component.scss']
})
export class MapAsset2Component implements OnInit {

  @Input() height = 300;
  @Input() assets: IAsset[];
  @Input() location: INewLocation;
  @Input() parentLocation: INewLocation;
  @Input() imageUrl: string;

  @Output() change: EventEmitter<{location: INewLocation, parent: INewLocation}> = new EventEmitter<{location: INewLocation, parent: INewLocation}>();

  currentMap: Map;
  center: IGeolocation;
  options: any;
  markers: Layer[] = [];
  locationsLayer: Layer[] = [];
  imageBounds: LatLngBounds;
  assetsBounds: LatLngBounds;

  markerClusterOptions: any;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {

    this.center = {
      lat: 0,
      lng: 0
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

    const assetIcon = divIcon({
      className: 'map-marker-asset',
      iconSize: null,
      html: '<div><span class="pxi-map-marker"></span></div>'
    });

    if (this.assets && this.assets.length) {
      for (const asset of this.assets) {
        const newMarker = marker(
          [asset.geolocation.lat, asset.geolocation.lng],
          {
            icon: assetIcon
          }
        ).bindPopup(fl => this.createAssetPopup(asset)).openPopup();
        this.markers.push(newMarker);
      }
    }


    const locationIcon = divIcon({
      className: 'map-marker-location',
      iconSize: null,
      html: '<div><span class="pxi-map-hotspot"></span></div>'
    });

    if (this.location) {
      const sublocations = this.location.sublocations;
      if (sublocations && sublocations.length) {
        for (const sublocation of sublocations) {
          sublocation.parent = this.location;
          const newMarker = marker(
            [sublocation.geolocation.lat, sublocation.geolocation.lng],
            {
              icon: locationIcon
            }
          ).bindPopup(fl => this.createLocationPopup(sublocation)).openPopup();

          /*.on('click', (e) => {
            const parent = this.location;
            this.change.emit({
              location: sublocation,
              parent,
            });
          });
          */
          this.locationsLayer.push(newMarker);
        }
      }
    }

    this.imageUrl = (this.imageUrl) ? (this.imageUrl) : (this.location) ? this.location.floorPlan : null;

    if (this.imageUrl) {
      const image: HTMLImageElement = new Image();
      image.src = this.imageUrl;
      image.onload = () => {
        const { width, height } = image;
        const ratioW = height / width;
        const ratioH = width / height;
        this.imageBounds = latLngBounds([0, 0], [(image.width / 100) * ratioW, (image.height / 100) * ratioH]);
        const imageMap = imageOverlay(this.imageUrl, this.imageBounds);
        this.options = {
          crs: CRS.Simple,
          layers: [imageMap],
          zoom: 1,
          maxZoom: 12,
        };
        this.changeDetectorRef.detectChanges();
      };
    } else {
      this.setAssetsAndLocationsBounds();
      this.options = {
        layers: tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoibmljb2xhc2FuY2VsIiwiYSI6ImNqeHZ4ejg0ZjAzeGIzcW1vazI0MHJia3MifQ.METba-D_-BOMeRbRnwDkFw'),
        zoom: 12,
        center: latLng(this.center.lat, this.center.lng),
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
      };
    }

  }


  private setAssetsAndLocationsBounds() {
    const geoJsonData = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[]]
      }
    };

    if (this.assets && this.assets.length) {
      this.assets.forEach(asset => {
        const {lng, lat} = asset.geolocation;
        geoJsonData.geometry.coordinates[0].push([lng, lat]);
      });
    }

    if (this.location) {
      const sublocations = this.location.sublocations;
      if (sublocations && sublocations.length){
        sublocations.forEach(sublocation => {
          const {lng, lat} = sublocation.geolocation;
          geoJsonData.geometry.coordinates[0].push([lng, lat]);
        });
      }
    }

    const geoJsonLayer = geoJSON(geoJsonData as GeoJsonObject);
    this.assetsBounds = geoJsonLayer.getBounds();
  }

  public createAssetPopup(asset: IAsset) {
    const popupEl: NgElement & WithProperties<MapAssetPopupComponent> = document.createElement('popup-element') as any;
    popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
    popupEl.asset = asset;
    document.body.appendChild(popupEl);
    return popupEl;
  }

  public createLocationPopup(location: INewLocation) {
    const popupEl: NgElement & WithProperties<MapAssetPopupComponent> = document.createElement('popup-element') as any;
    popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
    popupEl.eventEmitter = this.change;
    popupEl.location = location;
    document.body.appendChild(popupEl);
    return popupEl;
  }

  onMapReady(map: Map) {
    this.currentMap = map;
    if (this.imageBounds) {
      this.currentMap.fitBounds(this.imageBounds);
      this.currentMap.setMaxBounds(this.imageBounds);
    } else if (this.assetsBounds) {
      const currentZoom = this.currentMap.getZoom();
      this.currentMap.fitBounds(this.assetsBounds);
      this.currentMap.setZoom(currentZoom - 0.75);
    }
  }
}

