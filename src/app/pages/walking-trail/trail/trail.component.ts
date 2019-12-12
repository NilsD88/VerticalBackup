import { IPeopleCountingAsset } from 'src/app/models/peoplecounting/asset.model';
import { WalkingTrailAssetService } from 'src/app/services/walkingtrail/asset.service';
import { findLocationById } from 'src/app/shared/utils';
import { ActivatedRoute } from '@angular/router';
import { WalkingTrailLocationService } from './../../../services/walkingtrail/location.service';
import { Component, OnInit } from '@angular/core';
import { IImage } from 'ng-simple-slideshow';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';


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

  constructor(
    private locationService: WalkingTrailLocationService,
    public assetService: WalkingTrailAssetService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params) => {
      this.leaf = await this.locationService.getLocationById(params.id).toPromise();
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
      this.imageSources = [{url: 'https://cdn.pixabay.com/photo/2015/12/01/20/28/fall-1072821__480.jpg'}, {url: 'https://cdn.pixabay.com/photo/2015/09/09/16/05/forest-931706_1280.jpg'}];
    });
  }
}
