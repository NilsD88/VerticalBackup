import { cloneDeep } from 'lodash';
import { IWalkingTrailLocation, IWalkingTrailLocationSerie } from 'src/app/models/walkingtrail/location.model';
import { ILeafColors } from 'src/app/models/peoplecounting/leaf.model';
import { WalkingTrailLocationService } from './../../../services/walkingtrail/location.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {findLeaftsLocation} from '../utils';

import * as randomColor from 'randomcolor';
import * as moment from 'moment';
import * as mTZ from 'moment-timezone';

moment.locale('nl-be');
window.moment = moment;
mTZ();

@Component({
  selector: 'pvf-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public rootLocation: IWalkingTrailLocation;
  public leafs: IWalkingTrailLocation[];
  public leafColors: ILeafColors[];
  public lastYearLeafs: IWalkingTrailLocation[];
  public currentLeafs: IWalkingTrailLocation[];
  public listStyleValue = 'map';

  constructor(
    private locationService: WalkingTrailLocationService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.rootLocation = {
      id: 'xXx',
      parentId: null,
      geolocation: null,
      image: null,
      name: 'Locations',
      description: null,
      children: await this.locationService.getLocationsTree().toPromise()
    };
    this.changeLocation(this.rootLocation);
  }

  public decrease() {
    this.currentLeafs = decreaseLeafs(this.currentLeafs);
  }

  public increase() {
    this.currentLeafs = increaseLeafs(this.currentLeafs);
  }

  public listStyleOnChange(event) {
    const { value } = event;
    this.listStyleValue = value;
  }

  public changeLocation(location: IWalkingTrailLocation) {
    const leafs = [];
    findLeaftsLocation(location, leafs);
    const lastYearLeafs = cloneDeep(leafs);

    // Generate colors of trails
    this.leafColors = generateLeafColors(leafs);

    // Generate past week data
    generatePastWeekOfData(leafs);
    this.leafs = leafs;

    // Generate past year data
    generatePastYearOfData(lastYearLeafs);
    this.lastYearLeafs = lastYearLeafs;

    this.currentLeafs = cloneDeep(this.leafs);
    this.changeDetectorRef.detectChanges();
  }

}



export function decreaseLeafs(leafs: IWalkingTrailLocation[]): IWalkingTrailLocation[] {
  const decreasedLeafs = [];
  const decreasedLeafsRaw = {};
  for (const leaf of leafs) {
    if (leaf.parent !== null) {
      if (!decreasedLeafsRaw[leaf.parent.id]) {
        decreasedLeafsRaw[leaf.parent.id] = {
          id: leaf.parent.id,
          name: leaf.parent.name,
          series: leaf.series,
          parent: (leaf.parent || {}).parent,
          children: [leaf]
        };
      } else {
        decreasedLeafsRaw[leaf.parent.id].series = [
          ...decreasedLeafsRaw[leaf.parent.id].series,
          ...leaf.series
        ];
        decreasedLeafsRaw[leaf.parent.id].children.push(leaf);
      }
    }
  }
  Object.values(decreasedLeafsRaw).forEach((leaf: IWalkingTrailLocation) => {
    const series = {};
    leaf.series.forEach(serie => {
      series[serie.timestamp] = {
        timestamp: serie.timestamp,
        sum: ((series[serie.timestamp] || {}).sum || 0) + serie.sum
      };
    });
    decreasedLeafs.push({
      ...leaf,
      series: Object.values(series),
    });
  });
  if (decreasedLeafs.length > 0) {
    return decreasedLeafs;
  } else {
    return leafs;
  }
}

function increaseLeafs(leafs: IWalkingTrailLocation[]): IWalkingTrailLocation[] {
  const increasedLeafs = [];
  for (const leaf of leafs) {
    if (leaf.children && leaf.children.length > 0) {
      for (const child of leaf.children) {
        increasedLeafs.push(child);
      }
    }
  }
  if (increasedLeafs.length > 0) {
    return increasedLeafs;
  } else {
    return leafs;
  }
}

function generateLeafColors(leafs: IWalkingTrailLocation[]): ILeafColors[] {
  const leafColors = randomColor({count: leafs.length}).map((element, index) => ({
    id: leafs[index].id,
    color: element
  }));
  return leafColors;
}

function generatePastWeekOfData(leafs: IWalkingTrailLocation[]) {
  leafs.forEach(element => {
    element.series = generatePastWeekOfDataSeries();
  });
}

function generatePastYearOfData(leafs: IWalkingTrailLocation[]) {
  leafs.forEach(element => {
    element.series = generatePastYearOfDataSeries();
  });
}

function generatePastWeekOfDataSeries(): IWalkingTrailLocationSerie[] {
  const dataSeries: IWalkingTrailLocationSerie[] = [];
  for (let index = 0; index < 7; index++) {
    dataSeries.push(
      {
        timestamp: moment().startOf('isoWeek').add(index, 'day').valueOf(),
        sum: Math.floor(Math.random() * 101)
      }
    );
  }
  return dataSeries;
}

function generatePastYearOfDataSeries(): IWalkingTrailLocationSerie[] {
  const dataSeries: IWalkingTrailLocationSerie[] = [];
  for (let index = 0; index < 12; index++) {
    dataSeries.push(
      {
        timestamp: moment().subtract(12 - index, 'months').valueOf(),
        sum: Math.floor(Math.random() * 1001)
      }
    );
  }
  return dataSeries;
}