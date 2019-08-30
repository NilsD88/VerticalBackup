import { INewLocation } from './../../../../../src/app/models/new-location';
import { Component, OnInit, Optional, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import { NewLocationService } from 'src/app/services/new-location.service';

@Component({
  selector: 'pxs-location-popup',
  templateUrl: './location-popup.component.html',
  styleUrls: ['./location-popup.component.scss']
})
export class LocationPopupComponent implements OnInit {

  public viewAs = 'list';
  public displayAssets = true;
  public selectedLocation: INewLocation;
  public rootLocation: INewLocation;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private newLocationService: NewLocationService
  ) { }

  ngOnInit() {
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
    });

    if (this.data) {
      if (this.data.displayAssets) {
        this.displayAssets = this.data.displayAssets;
      }
      if (this.data.selectedLocation) {
        this.selectedLocation = this.data.selectedLocation;
      }
      if (this.data.viewAs) {
        this.viewAs = this.data.viewAs;
      }
    }
  }

}
