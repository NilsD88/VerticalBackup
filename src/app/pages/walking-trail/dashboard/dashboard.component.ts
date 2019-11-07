import { WalkingTrailLocationService } from './../../../services/walkingtrail/location.service';
import { IWalkingTrailLocation } from './../../../models/walkingtrail/location.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pvf-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public rootLocation: IWalkingTrailLocation;

  constructor(
    private locationService: WalkingTrailLocationService
  ) { }

  async ngOnInit() {
    this.rootLocation = {
      id: null,
      parentId: null,
      geolocation: null,
      image: null,
      name: 'Locations',
      description: null,
      children: await this.locationService.getLocationsTree().toPromise()
    };
  }

}
