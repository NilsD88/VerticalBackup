import { MatSnackBar } from '@angular/material/snack-bar';
import {Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges} from '@angular/core';
import { IGeolocation, Geolocation } from 'src/app/models/asset.model';
import { Map, latLng, tileLayer, icon, Layer, marker, LatLngBounds, latLngBounds, imageOverlay, CRS } from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { INewLocation } from 'src/app/models/new-location';
import { isNullOrUndefined } from 'util';


@Component({
  selector: 'pxs-map-new-location',
  templateUrl: './map-new-location.component.html',
  styleUrls: ['./map-new-location.component.scss']
})
export class MapNewLocationComponent implements OnInit, OnChanges {

  @Input() parentLocation: INewLocation;
  @Input() geolocation: IGeolocation;

  @Output() notify: EventEmitter<IGeolocation> = new EventEmitter<IGeolocation>();

  currentMap: Map;
  options: any;
  layers: any[];
  markers: Layer[] = [];
  imageBounds: LatLngBounds;
  backgroundLayer: Layer;
  provider: OpenStreetMapProvider;
  showNotifIfNoAddress = false;

  constructor(public snackBar: MatSnackBar) {

  }

  ngOnInit() {
    console.log(this.geolocation);
    if (this.parentLocation && !isNullOrUndefined(this.parentLocation.id)) {
      console.log("There is a parent location");
      const floorPlan = this.parentLocation.floorPlan;
      if(floorPlan){
        console.log("There is a floor plan");
        const image:HTMLImageElement = new Image();
        image.src = floorPlan;
        image.onload = () => {
          const { width, height } = image;
          const ratioW = height / width;
          const ratioH = width / height;
          this.imageBounds = latLngBounds([0, 0], [(image.width / 100) * ratioW, (image.height / 100) * ratioH]);
          const imageMap = imageOverlay(floorPlan, this.imageBounds);
          this.backgroundLayer = imageMap;
          this.options = {
            crs: CRS.Simple,
            layers: this.backgroundLayer,
            zoom:20,
          };
        }
      } else {
        console.log("There is no floor plan");
        const { lat, lng } = this.parentLocation.geolocation;
        this.backgroundLayer = tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoibmljb2xhc2FuY2VsIiwiYSI6ImNqeHZ4ejg0ZjAzeGIzcW1vazI0MHJia3MifQ.METba-D_-BOMeRbRnwDkFw'); 
        this.options = {
          layers: this.backgroundLayer,
          zoom: 12,
          center: latLng(lat, lng),
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        }
      }
    } else {
      console.log("There is no parent location");
      this.createOptionsMapWithUserGeolocation();
    }

    if (this.geolocation) {
      this.addMarker(this.geolocation);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const parentLocationChanges = changes.parentLocation;
    console.log(changes);
  }

  onMapReady(map: Map) {
    this.currentMap = map;

    if (this.imageBounds) {
      this.currentMap.fitBounds(this.imageBounds);
      this.currentMap.setMaxBounds(this.imageBounds);
    } else {
      if (this.geolocation) {
        map.panTo(this.geolocation);
      }
      this.provider = new OpenStreetMapProvider();
      const a = new GeoSearchControl({
        provider: this.provider,
        style: 'bar',
        showMarker: false,
        autoClose: true,
        autoComplete: true,
        autoCompleteDelay: 250,
        searchLabel: 'Enter address or geolocation (lattitude, longitude)',
      }).addTo(this.currentMap);

      map.on('geosearch/showlocation', (event: any) => {
        this.addMarker({
          lat: event.location.y,
          lng: event.location.x
        });
      });
    }
  }

  onMapClick(event) {
    if (event.layerPoint.y > 60) {
      const { lat, lng } = event.latlng;
      this.addMarker({lat, lng});
    }
  }

  eventHandler(event) {
    event.preventDefault();
    if (event.path && event.path.length) {
      if (event.path[0].className === 'glass ') {
        if (event.path[0].value) {
          this.markers = [];
          this.snackBar.open('No address found!', null, {
            duration: 2000,
          });
        }
      }
    }
  }

  createOptionsMapWithUserGeolocation() {
    this.backgroundLayer = tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoibmljb2xhc2FuY2VsIiwiYSI6ImNqeHZ4ejg0ZjAzeGIzcW1vazI0MHJia3MifQ.METba-D_-BOMeRbRnwDkFw'); 
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("geolocation");
        const { latitude, longitude } = position.coords;
        this.options = {
          layers: this.backgroundLayer,
          zoom: 12,
          center: latLng(latitude, longitude),
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        }
      });
    } else {
      console.log("default location");
      const defaultValue = new Geolocation(null);
      this.options = {
        layers: this.backgroundLayer,
        zoom: 12,
        center: latLng(defaultValue.lat, defaultValue.lng),
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      }
    }
  }

  addMarker(geolocation: IGeolocation) {
    const {lat, lng} = geolocation;
    const that = this;

    const newMarker = marker(
      [ lat, lng ],
      {
        icon: icon({
          iconSize: [ 25, 41 ],
          iconAnchor: [ 13, 41 ],
          iconUrl: 'assets/marker-icon.png',
          shadowUrl: 'assets/marker-shadow.png'
        }),
        draggable: true,
      }
    ).on('dragend', (event) => {
      this.sendNotifyEvent({
        lat: +event.target._latlng.lat,
        lng: +event.target._latlng.lng
      });
    });

    this.markers = [];
    this.markers.push(newMarker);

    this.sendNotifyEvent({
      lat,
      lng
    });
  }

  sendNotifyEvent(geolocation: IGeolocation): void {
    this.notify.emit(geolocation);
  }

  addMarkerWithUserPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        this.currentMap.flyTo({lat: latitude, lng: longitude}, 18);
        this.addMarker({
          lat: latitude,
          lng: longitude
        });
      });
    }
  }

  removeMarker() {
    console.log('remove marker');
    this.markers = [];
  }
}
