import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {NgElement, WithProperties} from '@angular/elements';
import {Asset, IAsset, IGeolocation} from 'src/app/models/asset.model';
import {Map, Layer, latLng, latLngBounds, imageOverlay, CRS, tileLayer, divIcon, marker, icon, LatLngBounds, geoJSON, MarkerCluster, Point} from 'leaflet';
import {MapAssetPopupComponent} from '../map-asset-popup/map-asset-popup.component';
import { GeoJsonObject } from 'geojson';
import { INewLocation } from 'src/app/models/new-location';

@Component({
  selector: 'pxs-map-asset',
  templateUrl: './map-asset.component.html',
  styleUrls: ['./map-asset.component.scss']
})
export class MapAssetComponent implements OnInit {

  @Input() height = 300;
  @Input() assets: IAsset[];
  @Input() locations: INewLocation[];
  @Input() parentLocation: INewLocation;
  @Input() imageUrl: string;

  @Output() change: EventEmitter<INewLocation> = new EventEmitter<INewLocation>();

  currentMap: Map;
  center: IGeolocation;
  options: any;
  markers: Layer[] = [];
  locationsLayer: Layer[] = [];
  imageBounds: LatLngBounds;
  assetsBounds: LatLngBounds;

  markerClusterOptions: any;

  ngOnInit() {

    console.log(this.locations);
    console.log(this.assets);

    this.center = {
      lat: 50.860160,
      lng: 4.358050
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

    for (const asset of this.assets) {
      const newMarker = marker(
        [asset.geolocation.lat, asset.geolocation.lng],
        {
          icon: assetIcon
        }
      ).bindPopup(fl => this.createPopupComponentWithMessage(asset)).openPopup();

      this.markers.push(newMarker);
    }

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
          zoom: 20,
        };
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

    const locationIcon = divIcon({
      className: 'map-marker-location',
      iconSize: null,
      html: '<div><span class="pxi-map-hotspot"></span></div>'
    });


    if (this.locations && this.locations.length) {
      for (const location of this.locations) {
        const newMarker = marker(
          [location.geolocation.lat, location.geolocation.lng],
          {
            icon: locationIcon
          }
        ).on('click', (e) => {
          console.log(e);
          this.change.emit(location);
        });

        this.locationsLayer.push(newMarker);
      }
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

    if (this.locations && this.locations.length){
      this.locations.forEach(location => {
        const {lng, lat} = location.geolocation;
        geoJsonData.geometry.coordinates[0].push([lng, lat]);
      });
    }

    const geoJsonLayer = geoJSON(geoJsonData as GeoJsonObject);
    this.assetsBounds = geoJsonLayer.getBounds();
  }

  public createPopupComponentWithMessage(asset: IAsset) {
    const popupEl: NgElement & WithProperties<MapAssetPopupComponent> = document.createElement('popup-element') as any;
    popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
    popupEl.asset = asset;
    console.log(asset);
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

