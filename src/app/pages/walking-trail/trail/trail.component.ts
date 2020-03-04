import { cloneDeep } from 'lodash';
import { IPeopleCountingAsset } from 'src/app/models/peoplecounting/asset.model';
import { WalkingTrailAssetService } from 'src/app/services/walkingtrail/asset.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WalkingTrailLocationService } from './../../../services/walkingtrail/location.service';
import { Component, OnInit } from '@angular/core';
import { IImage } from 'ng-simple-slideshow';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import * as randomColor from 'randomcolor';
import { UNKNOWN_PARENT_ID } from 'src/app/shared/global';
import { isNullOrUndefined } from 'util';


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
    private router: Router,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.routeReuseStrategy.shouldDetach = () => true;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params) => {
      try {
        this.leaf = await this.locationService.getLocationById(params.id).toPromise();
      } catch (error) {
        console.error(error);
        try {
          this.leaf = await this.locationService.getLocationByIdWithoutParent(params.id).toPromise();
          if (isNullOrUndefined(this.leaf)) {
            throw {
              message: '404'
            };
          }
        } catch (error2) {
          await this.router.navigate(['/error/404']);
          console.error(error2);
        }
      }
      this.assetColors = randomColor({
        count: this.leaf.assets.length
      });
      this.assets = await this.assetService.getAssetsByLocationId(this.leaf.id).toPromise();
      this.leaf.assets = this.assets;
      if (this.leaf.parent) {
        this.parentLocation = this.leaf.parent;
      } else {
        let locationTree = await this.locationService.getLocationsTree().toPromise();
        locationTree = locationTree.filter(location => location.module === 'PEOPLE_COUNTING_WALKING_TRAIL');
        if (locationTree.length > 1 && locationTree.some(location => location.id === this.leaf.id)) {
          this.parentLocation = {
            id: null,
            children: [
              ...locationTree
            ]
          };
        } else {
          this.parentLocation = {
            id: UNKNOWN_PARENT_ID,
            children: [
              this.leaf
            ]
          };
        }
        this.leaf.parent = this.parentLocation;
      }
    });
  }
}
