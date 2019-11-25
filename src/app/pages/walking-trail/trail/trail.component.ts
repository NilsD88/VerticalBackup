import { cloneDeep } from 'lodash';
import { findLocationById } from 'src/app/shared/utils';
import { ActivatedRoute } from '@angular/router';
import { WalkingTrailLocationService } from './../../../services/walkingtrail/location.service';
import { Component, OnInit } from '@angular/core';
import { IImage } from 'ng-simple-slideshow';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { IPeopleCountingAssetSerie } from 'src/app/models/peoplecounting/asset.model';



import * as moment from 'moment';

@Component({
  selector: 'pvf-trail',
  templateUrl: './trail.component.html',
  styleUrls: ['./trail.component.scss']
})
export class TrailComponent implements OnInit {

  public leaf: IPeopleCountingLocation;
  public lastMonthLeafData: IPeopleCountingLocation;
  public parentLocation: IPeopleCountingLocation;
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

      this.lastMonthLeafData = cloneDeep(this.leaf);

      // Generate last month data
      // TODO: get last month data per day and per asset (location.asset.series) for a specific location
      this.lastMonthLeafData.assets.forEach(asset => {
        asset.series = generatePastMonthOfDataSeries();
      });
    });
  }
}

function generatePastMonthOfDataSeries(): IPeopleCountingAssetSerie[] {
  const dataSeries: IPeopleCountingAssetSerie[] = [];
  const daysInMonth = moment().subtract(1, 'months').date(1).daysInMonth();
  for (let index = 0; index < daysInMonth; index++) {
    dataSeries.push(
      {
        timestamp: moment().subtract(1, 'months').date(1).add(index, 'days').valueOf(),
        value: Math.floor(Math.random() * 101)
      }
    );
  }
  return dataSeries;
}
