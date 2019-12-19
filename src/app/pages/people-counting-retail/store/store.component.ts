import { PeopleCountingRetailAssetService } from './../../../services/peoplecounting-retail/asset.service';
import { PeopleCountingRetailLocationService } from './../../../services/peoplecounting-retail/location.service';
import { findLocationById } from 'src/app/shared/utils';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { IPeopleCountingAsset } from 'src/app/models/peoplecounting/asset.model';
import * as randomColor from 'randomcolor';

@Component({
  selector: 'pvf-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  public leaf: IPeopleCountingLocation;
  public lastMonthLeafData: IPeopleCountingLocation;
  public parentLocation: IPeopleCountingLocation;
  public assets: IPeopleCountingAsset[];
  public assetUrl = '/private/peoplecounting/detail/';
  public assetColors: string[];
  public locale: string;

  constructor(
    public locationService: PeopleCountingRetailLocationService,
    public assetService: PeopleCountingRetailAssetService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe(async (params) => {
      this.leaf = await this.locationService.getLocationById(params.id).toPromise();
      this.assetColors = randomColor({
        count: 100 // TODO: should be number of assets, but we don't know at this level
      });
      this.assets = await this.assetService.getAssetsByLocationId(this.leaf.id).toPromise();
      const rootLocation = {
        id: null,
        parentId: null,
        geolocation: null,
        image: null,
        name: 'Locations',
        description: null,
        children:  await this.locationService.getLocationsTree().toPromise()
      };
      if (this.leaf.parent) {
        const parentLocation = findLocationById(rootLocation, this.leaf.parent.id).location;
        this.parentLocation = parentLocation;
      } else {
        this.parentLocation = rootLocation;
      }
      this.leaf.parent = this.parentLocation;
    });
  }
}
