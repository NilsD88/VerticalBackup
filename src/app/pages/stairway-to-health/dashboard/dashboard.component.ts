import {
  cloneDeep
} from 'lodash';
import {
  WalkingTrailLocationService
} from './../../../services/walkingtrail/location.service';
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import {
  findLeaftsLocation
} from '../../walking-trail/utils';
import {
  generateLeafColors,
  increaseLeafs,
  decreaseLeafs
} from 'src/app/shared/utils';
import {
  ILeafColors
} from 'src/app/shared/people-counting/dashboard/leaf.model';

import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import {
  IPeopleCountingLocation,
  IPeopleCountingLocationSerie
} from 'src/app/models/peoplecounting/location.model';


moment.locale('nl-be');
window.moment = moment;
mTZ();

@Component({
  selector: 'pvf-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public rootLocation: IPeopleCountingLocation;
  public leafs: IPeopleCountingLocation[];
  public leafColors: ILeafColors[];
  public lastYearLeafs: IPeopleCountingLocation[];
  public currentLeafs: IPeopleCountingLocation[];
  public listStyleValue = 'map';
  public leafUrl = '/private/peoplecounting/store';

  constructor(
    private locationService: WalkingTrailLocationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

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

    const oiazej = 2;
  }

  public decrease() {
    this.currentLeafs = decreaseLeafs(this.currentLeafs);
  }

  public increase() {
    this.currentLeafs = increaseLeafs(this.currentLeafs);
  }

  public listStyleOnChange(event) {
    const {
      value
    } = event;
    this.listStyleValue = value;
  }

  public changeLocation(location: IPeopleCountingLocation) {
    const leafs = [];
    findLeaftsLocation(location, leafs);
    const lastYearLeafs = cloneDeep(leafs);

    // Generate colors of trails
    this.leafColors = generateLeafColors(leafs);

    // Generate past week data
    // TODO: get the past week data with day interval for each location (location.series)
    generatePastWeekOfData(leafs);
    this.leafs = leafs;

    // Generate past year data
    generatePastYearOfData(lastYearLeafs);
    // TODO: get the past year data with month interval for each location(location.series)
    this.lastYearLeafs = lastYearLeafs;

    this.currentLeafs = cloneDeep(this.leafs);
    this.changeDetectorRef.detectChanges();
  }

}


function generatePastWeekOfData(leafs: IPeopleCountingLocation[]) {
  leafs.forEach(element => {
    element.series = generatePastWeekOfDataSeries();
  });
}

function generatePastYearOfData(leafs: IPeopleCountingLocation[]) {
  leafs.forEach(element => {
    element.series = generatePastYearOfDataSeries();
  });
}

function generatePastWeekOfDataSeries(): IPeopleCountingLocationSerie[] {
  const dataSeries: IPeopleCountingLocationSerie[] = [];
  for (let index = 0; index < 7; index++) {
    dataSeries.push({
      timestamp: moment().startOf('isoWeek').add(index, 'day').valueOf(),
      valueIn: Math.floor(Math.random() * 101)
    });
  }
  return dataSeries;
}

function generatePastYearOfDataSeries(): IPeopleCountingLocationSerie[] {
  const dataSeries: IPeopleCountingLocationSerie[] = [];
  for (let index = 0; index < 12; index++) {
    dataSeries.push({
      timestamp: moment().subtract(12 - index, 'months').valueOf(),
      valueIn: Math.floor(Math.random() * 1001)
    });
  }
  return dataSeries;
}
