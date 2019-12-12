import { PeopleCountingRetailAssetService } from './../../../services/peoplecounting-retail/asset.service';
import { PeopleCountingRetailLocationService } from './../../../services/peoplecounting-retail/location.service';
import { findLocationById } from 'src/app/shared/utils';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
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
    public locationService: PeopleCountingRetailLocationService,
    public assetService: PeopleCountingRetailAssetService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params) => {
      this.leaf = await this.locationService.getLocationById(params.id).toPromise();
      const rootLocation = {
        id: null,
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
