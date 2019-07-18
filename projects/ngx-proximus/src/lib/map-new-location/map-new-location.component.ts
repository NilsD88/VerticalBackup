import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import { IGeolocation, Geolocation } from 'src/app/models/asset.model';
import { Map, latLng, tileLayer, icon, Layer, marker } from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';


@Component({
  selector: 'pxs-map-new-location',
  templateUrl: './map-new-location.component.html',
  styleUrls: ['./map-new-location.component.scss']
})
export class MapNewLocationComponent implements OnInit {

  @Output() notify: EventEmitter<IGeolocation> = new EventEmitter<IGeolocation>();

  currentMap:Map;
  options: any;
  markers: Layer[] = [];

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("geolocation");
        const { latitude, longitude } = position.coords;
        this.options = { 
          layers: tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoibmljb2xhc2FuY2VsIiwiYSI6ImNqeHZ4ejg0ZjAzeGIzcW1vazI0MHJia3MifQ.METba-D_-BOMeRbRnwDkFw'),
          zoom: 12,
          center: latLng(latitude, longitude),
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        }
      });
    } else {
      console.log("default location");
      const defaultValue = new Geolocation(null);
      this.options = { 
        layers: tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoibmljb2xhc2FuY2VsIiwiYSI6ImNqeHZ4ejg0ZjAzeGIzcW1vazI0MHJia3MifQ.METba-D_-BOMeRbRnwDkFw'),
        zoom: 12,
        center: latLng(defaultValue.lat, defaultValue.lng),
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      }
    }
  }
  
  onMapReady(map: Map) {
    this.currentMap = map;
    const provider = new OpenStreetMapProvider();
    
    new GeoSearchControl({
      provider: provider, 
      style: "bar",
      showMarker: false,
      autoClose: true,
      autoComplete: true,
      autoCompleteDelay: 250,
    }).addTo(map);

    map.on('geosearch/showlocation', (event: any) => {   
      const newMarker = marker(
        [ event.location.y, event.location.x],
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
      })

      this.markers = [];
      this.markers.push(newMarker);

      this.sendNotifyEvent({
        lat: +event.location.y,
        lng: +event.location.x,
      });
    });
  }

  sendNotifyEvent(geolocation:IGeolocation):void {
    this.notify.emit(geolocation);
  }

}





