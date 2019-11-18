import { findLocationById } from 'src/app/shared/utils';
import { ActivatedRoute } from '@angular/router';
import { WalkingTrailLocationService } from './../../../services/walkingtrail/location.service';
import { Component, OnInit } from '@angular/core';
import { IWalkingTrailLocation, IWalkingTrailLocationSerie } from 'src/app/models/walkingtrail/location.model';
import { IWalkingTrailAssetSerie } from 'src/app/models/walkingtrail/asset.model';

import * as moment from 'moment';
import { findLeaftsLocation } from '../utils';
import { IImage } from 'ng-simple-slideshow';


@Component({
  selector: 'pvf-trail',
  templateUrl: './trail.component.html',
  styleUrls: ['./trail.component.scss']
})
export class TrailComponent implements OnInit {

  public leaf: IWalkingTrailLocation;
  public parentLocation: IWalkingTrailLocation;
  public imageSources: string[] | IImage[];

  public locale: string;

  constructor(
    private locationService: WalkingTrailLocationService,
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

      this.imageSources = [{url: 'https://cdn.pixabay.com/photo/2015/12/01/20/28/fall-1072821__480.jpg'}, {url: 'https://cdn.pixabay.com/photo/2015/09/09/16/05/forest-931706_1280.jpg'}];
    });
  }
}