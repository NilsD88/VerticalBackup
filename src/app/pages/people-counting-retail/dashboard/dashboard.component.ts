import { PeopleCountingRetailLocationService } from './../../../services/peoplecounting-retail/location.service';
import { PeopleCountingLocationService } from './../../../services/peoplecounting/location.service';
import {
  cloneDeep
} from 'lodash';
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import {
  findLeafLocations
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
    private locationService: PeopleCountingRetailLocationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.rootLocation = {
      id: null,
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
    const {
      value
    } = event;
    this.listStyleValue = value;
  }

  public changeLocation(location: IPeopleCountingLocation) {
    const leafs: IPeopleCountingLocation[] = [];
    findLeafLocations(location, leafs);
    const lastYearLeafs = cloneDeep(leafs);
    this.leafColors = generateLeafColors(leafs);

    // Get the past week data with day interval for each leafs
    this.locationService.getLocationsDataByIds(
      leafs.map(leaf => leaf.id),
      'DAILY',
      moment().startOf('isoWeek').subtract(1, 'week').valueOf(),
      moment().startOf('isoWeek').valueOf(),
    ).subscribe(
      (result) => {
        leafs.forEach(leaf => {
          const leafIndex = result.findIndex((x => x.id === leaf.id));
          if (leafIndex > -1) {
            leaf.series = result[leafIndex].series;
          } else {
            leaf.series = [];
          }
        });
        this.leafs = leafs;
        this.currentLeafs = cloneDeep(this.leafs);
        this.changeDetectorRef.detectChanges();
      }
    );

    // Get the past year data with month interval for each leafs
    this.locationService.getLocationsDataByIds(
      leafs.map(leaf => leaf.id),
      'MONTHLY',
      moment().subtract(1, 'year').set({month: 0, date: 1, hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
      moment().set({month: 0, date: 1, hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
    ).subscribe(
      (result) => {
        lastYearLeafs.forEach(leaf => {
          const leafIndex = result.findIndex((x => x.id === leaf.id));
          if (leafIndex > -1) {
            leaf.series = result[leafIndex].series;
          } else {
            leaf.series = [];
          }
        });
        this.lastYearLeafs = lastYearLeafs;
        this.changeDetectorRef.detectChanges();
      }
    );
  }

}

