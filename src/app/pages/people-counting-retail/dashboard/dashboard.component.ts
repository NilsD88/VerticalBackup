import { IGeolocation } from './../../../models/geolocation.model';
import { Component, OnInit } from '@angular/core';
import {
  ILocation
} from '../../../models/g-location.model';

import {MOCK_LOCATIONS} from '../../../mocks/newlocations'

@Component({
  selector: 'pvf-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public rootLocation: ILocation;
  public geoLocation: IGeolocation;


  

  


  public series;

  constructor() { 

    this.rootLocation = MOCK_LOCATIONS[0];
    this.series = [23,22.45,33,23,10,2]
    this.geoLocation = this.rootLocation.geolocation;

  }

  ngOnInit() {
  }

}
