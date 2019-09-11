import {Component, OnInit} from '@angular/core';
import { NewLocationService } from 'src/app/services/new-location.service';
import { INewLocation } from 'src/app/models/new-location';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'pvf-manage-locations',
  templateUrl: './manage-locations.component.html',
  styleUrls: ['./manage-locations.component.scss'],
})
export class ManageLocationsComponent implements OnInit {

  public rootLocation: INewLocation;
  public selectedLocation: INewLocation;

  constructor(
    private newLocationService: NewLocationService,
    private activedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.activedRoute.params.subscribe(async (params) => {
      const selectedLocationId = params.selectedLocationId;
      if (selectedLocationId) {
        this.selectedLocation = await this.newLocationService.getLocationById(selectedLocationId).toPromise();
      }
    });

  }

}
