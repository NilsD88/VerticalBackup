import { PeopleCountingRetailLocationService } from './../../../../../services/peoplecounting-retail/location.service';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  IPeopleCountingLocation
} from 'src/app/models/peoplecounting/location.model';
import {
  TranslateService
} from '@ngx-translate/core';
import * as moment from 'moment';
import * as mTZ from 'moment-timezone';


interface IData {
  totalYesterday: number;
  totalLastWeek: number;
  differenceLastWeek: number;
  differenceToday: number;
}

@Component({
  selector: 'pvf-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnChanges {



  @Input() leaf: IPeopleCountingLocation;

  public data: IData;
  public locale: string;



  constructor(
    private translateService: TranslateService,
    private locationService: PeopleCountingRetailLocationService
  ) {}

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
    const totalYesterday = await this.locationService.getLocationsDataByIds(
      [this.leaf.id],
      'DAILY',
      moment().subtract(1, 'days').set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
      moment().set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
    ).toPromise();

    const totalTwoLastWeeks = await this.locationService.getLocationsDataByIds(
      [this.leaf.id],
      'WEEKLY',
      moment().startOf('isoWeek').subtract(2, 'week').set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
      moment().startOf('isoWeek').set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
    ).toPromise();

    const today = await this.locationService.getLocationsDataByIds(
      [this.leaf.id],
      'HOURLY',
      moment().set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
      moment().valueOf(),
    ).toPromise();

    const todayLastWeek = await this.locationService.getLocationsDataByIds(
      [this.leaf.id],
      'HOURLY',
      moment().subtract(1, 'weeks').set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
      moment().subtract(1, 'weeks').valueOf(),
    ).toPromise();

    const totalToday = today.length ? today[0].series.reduce((a, b) => a + b.valueIn, 0) : null;
    const totalTodayLastWeek = todayLastWeek.length ? todayLastWeek[0].series.reduce((a, b) => a + b.valueIn, 0) : null;

    const totalLastWeek =  totalTwoLastWeeks.length ? totalTwoLastWeeks[0].series[1].valueIn : null;
    const totalBeforeLastWeek = totalTwoLastWeeks.length ? totalTwoLastWeeks[0].series[0].valueIn : null;

    this.data = {
      totalYesterday: totalYesterday.length ? totalYesterday[0].series[0].valueIn : null,
      totalLastWeek,
      differenceLastWeek: totalLastWeek - totalBeforeLastWeek,
      differenceToday: totalToday - totalTodayLastWeek
    };
  }





}
