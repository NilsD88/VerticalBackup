import { ILocation } from 'src/app/models/g-location.model';
import { Component, OnInit, Optional, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { NewLocationService } from 'src/app/services/new-location.service';

@Component({
  selector: 'pxs-location-popup',
  templateUrl: './location-popup.component.html',
  styleUrls: ['./location-popup.component.scss']
})
export class LocationPopupComponent implements OnInit {

  public viewAs = 'list';
  public displayAssets = true;
  public selectedLocation: ILocation;
  public rootLocation: ILocation;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LocationPopupComponent>,
    private newLocationService: NewLocationService
  ) { }

  ngOnInit() {
    this.newLocationService.getLocationsTree().subscribe((locations: ILocation[]) => {
      this.rootLocation = {
        id: null,
        parentId: null,
        geolocation: null,
        image: null,
        name: 'Locations',
        description: null,
        children: locations,
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
