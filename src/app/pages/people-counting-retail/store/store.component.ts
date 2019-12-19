import { findLocationById } from 'src/app/shared/utils';
import { ActivatedRoute } from '@angular/router';
import { PeopleCountingLocationService } from './../../../services/peoplecounting/location.service';
import { Component, OnInit } from '@angular/core';
import { IImage } from 'ng-simple-slideshow';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';

import * as moment from 'moment';

@Component({
  selector: 'pvf-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  public leaf: IPeopleCountingLocation;
  public lastMonthLeafData: IPeopleCountingLocation;
  public parentLocation: IPeopleCountingLocation;

  public locale: string;

  constructor(
    private locationService: PeopleCountingLocationService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params) => {
      this.leaf = await this.locationService.getLocationById(params.id).toPromise();
      const rootLocation = {
        id: 'xXx',
        parentId: null,
        geolocation: null,
        image: null,
        name: 'Locations',
        description: null,
        children:  await this.locationService.getLocationsTree().toPromise()
      };
      const parentLocation = findLocationById(rootLocation, this.leaf.parent.id).location;
      this.parentLocation = parentLocation;
      console.log(this.leaf);
    });
  }
}
