import {Component, Input, OnChanges, OnInit} from '@angular/core';
// import {circle, icon, latLng, marker, polygon, tileLayer} from 'leaflet';
// import 'leaflet/dist/images/marker-shadow.png';
// import 'leaflet/dist/images/marker-icon.png';

@Component({
  selector: 'pxs-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnChanges {

  @Input() height = 300;

  @Input() layers: { lng: number; lat: number; }[] = [];

  constructor() {
  }

  ngOnChanges() {
    console.log(this.layers);

  }

}
