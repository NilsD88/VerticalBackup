import {Component, Input, OnInit} from '@angular/core';
import {NgElement, WithProperties} from '@angular/elements';
import {Asset, IAsset, IGeolocation} from 'src/app/models/asset.model';
import {Map, Layer, latLng, latLngBounds, imageOverlay, CRS, tileLayer, marker, icon, LatLngBounds} from 'leaflet';
import {MapAssetPopupComponent} from '../map-asset-popup/map-asset-popup.component';

@Component({
  selector: 'pxs-map-asset',
  templateUrl: './map-asset.component.html',
  styleUrls: ['./map-asset.component.scss']
})
export class MapAssetComponent implements OnInit {

  @Input() height = 300;
  @Input() assets: IAsset[];
  @Input() imageUrl: string;

  currentMap: Map;
  geolocation: IGeolocation;
  options: any;
  markers: Layer[] = [];
  imageBounds: LatLngBounds;


  ngOnInit() {

    this.geolocation = this.assets[0].geolocation;

    for (const asset of this.assets) {
      const newMarker = marker(
        [asset.geolocation.lat, asset.geolocation.lng],
        {
          icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: 'assets/marker-icon.png',
            shadowUrl: 'assets/marker-shadow.png'
          })
        }
      ).bindPopup(fl => this.createPopupComponentWithMessage(asset)).openPopup();

      this.markers.push(newMarker);
    }

    if (this.imageUrl) {
      const image: HTMLImageElement = new Image();
      image.src = this.imageUrl;
      image.onload = () => {
        const { width, height } = image;
        const ratioW = height/width;
        const ratioH = width/height;
        this.imageBounds = latLngBounds([0, 0], [(image.width/100)*ratioW, (image.height/100)*ratioH]);
        const imageMap = imageOverlay(this.imageUrl, this.imageBounds);
        this.options = {
          crs: CRS.Simple,
          layers: [imageMap],
          zoom:20,
        };
      };
    } else {
      this.options = {
        layers: tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoibmljb2xhc2FuY2VsIiwiYSI6ImNqeHZ4ejg0ZjAzeGIzcW1vazI0MHJia3MifQ.METba-D_-BOMeRbRnwDkFw'),
        zoom: 12,
        center: latLng(this.geolocation.lat, this.geolocation.lng),
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
      };
    }
  }

  public createPopupComponentWithMessage(asset: IAsset) {
    const popupEl: NgElement & WithProperties<MapAssetPopupComponent> = document.createElement('popup-element') as any;
    popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
    popupEl.asset = asset;
    document.body.appendChild(popupEl);
    return popupEl;
  }

  onMapReady(map: Map) {
    this.currentMap = map;
    if (this.imageBounds) {
      this.currentMap.fitBounds(this.imageBounds);
      this.currentMap.setMaxBounds(this.imageBounds);
    }
  }
}

