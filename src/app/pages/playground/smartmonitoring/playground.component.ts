import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { INewLocation, NewLocation } from 'src/app/models/new-location';
import { NewLocationService } from 'src/app/services/new-location.service';


@Component({
  selector: 'pvf-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlaygroundComponent implements OnInit {

  public rootLocation: INewLocation;

  constructor(private changeDetectorRef: ChangeDetectorRef, private newLocationService: NewLocationService) {}

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
  }
}
