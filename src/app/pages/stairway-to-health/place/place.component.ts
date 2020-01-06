import { StairwayToHealthLocationService } from './../../../services/stairway-to-health/location.service';
import { findLocationById } from 'src/app/shared/utils';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { IPeopleCountingAsset } from 'src/app/models/peoplecounting/asset.model';
import * as randomColor from 'randomcolor';
import { StairwayToHealthAssetService } from 'src/app/services/stairway-to-health/asset.service';

@Component({
  selector: 'pvf-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss']
})
export class PlaceComponent implements OnInit {

  public leaf: IPeopleCountingLocation;
  public lastMonthLeafData: IPeopleCountingLocation;
  public parentLocation: IPeopleCountingLocation;
  public assets: IPeopleCountingAsset[];
  public assetUrl = '/private/stairwaytohealth/detail/';
  public assetColors: string[];
  public locale: string;

  constructor(
    public locationService: StairwayToHealthLocationService,
    public assetService: StairwayToHealthAssetService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe(async (params) => {
      this.leaf = await this.locationService.getLocationById(params.id).toPromise();
      this.assetColors = randomColor({
        count: this.leaf.assets.length
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
