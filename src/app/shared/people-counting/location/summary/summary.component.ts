import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {IPeopleCountingLocation} from 'src/app/models/peoplecounting/location.model';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import {Stairway2HealthLocationService} from 'src/app/services/stairway-2-health/location.service';
import {SmartCountingLocationService} from 'src/app/services/smart-counting/location.service';


interface IData {
  totalYesterday: number;
  totalLastWeek: number;
  differenceLastWeek: number;
  differenceToday: number;
}

@Component({
  selector: 'pvf-peoplecounting-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnChanges {

  @Input() leaf: IPeopleCountingLocation;
  @Input() locationService: SmartCountingLocationService | Stairway2HealthLocationService;

  public data: IData;
  public locale: string;

  constructor(
    private translateService: TranslateService
  ) {
  }

  ngOnInit() {
    this.locale = this.translateService.currentLang;
    moment.locale(this.locale + '-be');
    window.moment = moment;
    mTZ();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.leaf) {
      if (changes.leaf.currentValue && changes.leaf.currentValue !== changes.leaf.previousValue) {
        this.getAllData();
      }
    }
  }


  async getAllData() {
    let totalYesterday: IPeopleCountingLocation[] = [];
    let totalTwoLastWeeks: IPeopleCountingLocation[] = [];
    let today: IPeopleCountingLocation[] = [];
    let todayLastWeek: IPeopleCountingLocation[] = [];

    try {
      totalYesterday = await this.locationService.getLocationsDataByIds(
        [this.leaf.id],
        'DAILY',
        moment().subtract(1, 'day').startOf('day').valueOf(),
        moment().subtract(1, 'day').endOf('day').valueOf(),
      ).toPromise();
    } catch (error) {
      console.error('error while fetching totalYesterday data');
      console.error(error);
    }

    try {
      totalTwoLastWeeks = await this.locationService.getLocationsDataByIds(
        [this.leaf.id],
        'WEEKLY',
        moment().startOf('isoWeek').subtract(2, 'week').startOf('day').valueOf(),
        moment().startOf('isoWeek').subtract(1, 'week').endOf('week').valueOf(),
      ).toPromise();
    } catch (error) {
      console.error('error while fetching totalTwoLastWeeks data');
      console.error(error);
    }

    try {
      today = await this.locationService.getLocationsDataByIds(
        [this.leaf.id],
        'HOURLY',
        moment().startOf('day').valueOf(),
        moment().endOf('day').valueOf(),
      ).toPromise();
    } catch (error) {
      console.error('error while fetching today data');
      console.error(error);
    }

    try {
      todayLastWeek = await this.locationService.getLocationsDataByIds(
        [this.leaf.id],
        'HOURLY',
        moment().subtract(1, 'weeks').startOf('day').valueOf(),
        moment().subtract(1, 'weeks').endOf('day').valueOf(),
      ).toPromise();
    } catch (error) {
      console.error('error while fetching todayLastWeek data');
      console.error(error);
    }

    const totalToday = today.length ? today[0].series.reduce((a, b) => a + b.valueIn, 0) : null;
    const totalTodayLastWeek = todayLastWeek.length ? todayLastWeek[0].series.reduce((a, b) => a + b.valueIn, 0) : null;

    const totalLastWeek = totalTwoLastWeeks.length ? (totalTwoLastWeeks[0].series.length ? totalTwoLastWeeks[0].series[1].valueIn : null) : null;
    const totalBeforeLastWeek = totalTwoLastWeeks.length ? (totalTwoLastWeeks[0].series.length ? totalTwoLastWeeks[0].series[0].valueIn : null) : null;

    this.data = {
      totalYesterday: totalYesterday.length ? (totalYesterday[0].series.length ? totalYesterday[0].series[0].valueIn : null) : null,
      totalLastWeek,
      differenceLastWeek: totalLastWeek - totalBeforeLastWeek,
      differenceToday: totalToday - totalTodayLastWeek
    };
  }

}
