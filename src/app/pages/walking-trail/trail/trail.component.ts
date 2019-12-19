import { IPeopleCountingAsset } from 'src/app/models/peoplecounting/asset.model';
import { WalkingTrailAssetService } from 'src/app/services/walkingtrail/asset.service';
import { findLocationById } from 'src/app/shared/utils';
import { ActivatedRoute } from '@angular/router';
import { WalkingTrailLocationService } from './../../../services/walkingtrail/location.service';
import { Component, OnInit } from '@angular/core';
import { IImage } from 'ng-simple-slideshow';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import * as randomColor from 'randomcolor';


@Component({
  selector: 'pvf-trail',
  templateUrl: './trail.component.html',
  styleUrls: ['./trail.component.scss']
})
export class TrailComponent implements OnInit {

  public leaf: IPeopleCountingLocation;
  public assets: IPeopleCountingAsset[];
  public lastMonthLeafData: IPeopleCountingLocation;
  public parentLocation: IPeopleCountingLocation;
  public imageSources: string[] | IImage[];
  public locale: string;
  public assetUrl = '/private/walkingtrail/detail/';
  public assetColors: string[];

  constructor(
    private locationService: WalkingTrailLocationService,
    public assetService: WalkingTrailAssetService,
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
