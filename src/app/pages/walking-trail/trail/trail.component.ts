import { SharedService } from './../../../services/shared.service';
import { IPeopleCountingAsset } from 'src/app/models/peoplecounting/asset.model';
import { WalkingTrailAssetService } from 'src/app/services/walkingtrail/asset.service';
import { findLocationById } from 'src/app/shared/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { WalkingTrailLocationService } from './../../../services/walkingtrail/location.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private sharedService: SharedService,
    private router: Router,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.routeReuseStrategy.shouldDetach = () => true;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params) => {
      const isLocationAdmin = this.sharedService.user.hasRole('pxs:iot:location_admin');
      let rootLocation: IPeopleCountingLocation;
      if (isLocationAdmin) {
        rootLocation = (await this.locationService.getLocationsTree().toPromise())[0];
      } else {
        rootLocation = {
          id: null,
          parentId: null,
          geolocation: null,
          image: null,
          name: 'Locations',
          description: null,
          children:  await this.locationService.getLocationsTree().toPromise()
        };
      }
      if (isLocationAdmin && rootLocation.id === params.id) {
        this.leaf = await this.locationService.getLocationByIdWithoutParent(params.id).toPromise();
      } else {
        this.leaf = await this.locationService.getLocationById(params.id).toPromise();
      }
      this.assetColors = randomColor({
        count: this.leaf.assets.length
      });
      this.assets = await this.assetService.getAssetsByLocationId(this.leaf.id).toPromise();
      this.leaf.assets = this.assets;
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
