import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {circle, icon, latLng, marker, polygon, tileLayer} from 'leaflet';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';

@Component({
  selector: 'pxs-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnChanges {
  get config() {
    return this.options;
  }

  @Input('config')
  set config(value) {
    if (value) {
      this.options.center = value.center;
      this.options.zoom = value.zoom;
    }
  }

  @Input() height = 300;

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'})
    ],
    scrollWheelZoom: false,
    zoom: 8,
    center: latLng(50.860305, 4.357905)
  };

  @Input() layers = [];

  constructor() {
  }

  ngOnChanges() {
    console.log(this.layers);

  }

}
