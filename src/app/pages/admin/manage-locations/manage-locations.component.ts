import { SharedService } from './../../../services/shared.service';
import { SubSink } from 'subsink';
import {Component, OnInit, OnDestroy} from '@angular/core';
import { LocationService } from 'src/app/services/location.service';
import { ILocation } from 'src/app/models/location.model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'pvf-manage-locations',
  templateUrl: './manage-locations.component.html',
  styleUrls: ['./manage-locations.component.scss'],
})
export class ManageLocationsComponent implements OnInit, OnDestroy {

  public rootLocation: ILocation;
  public selectedLocation: ILocation;

  private subs = new SubSink();

  constructor(
    private locationService: LocationService,
    private activedRoute: ActivatedRoute,
    public sharedService: SharedService
  ) {}

  ngOnInit() {
    this.subs.sink = this.activedRoute.params.subscribe(async (params) => {
      const selectedLocationId = params.selectedLocationId;
      if (selectedLocationId) {
        this.selectedLocation = await this.locationService.getLocationById(selectedLocationId).toPromise();
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
