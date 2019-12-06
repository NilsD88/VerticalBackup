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



@Component({
  selector: 'pvf-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnChanges {



  @Input() leaf: IPeopleCountingLocation;
  public totalCountYesterDay: number;
  public differenceCurrentDayAndSameDayLastWeek: number;
  public totalLastWeek: number;
  public differenceLastWeekAndWeekBefore: number;
  public locale: string;



  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    this.locale = this.translateService.currentLang;
    moment.locale(this.locale + '-be');
    window.moment = moment;
    mTZ();

    if (this.leaf) {
      this.generateDummyData();
      this.getTotalCountYesterday();
      this.getDifferenceCurrentDayAndSameDayLastWeek()
      this.getTotalCountLastWeek();
      this.getDifferenceLastWeekAndWeekBefore();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.leaf) {
      this.generateDummyData();
      this.getTotalCountYesterday();
      this.getDifferenceCurrentDayAndSameDayLastWeek()
      this.getTotalCountLastWeek();
      this.getDifferenceLastWeekAndWeekBefore();
    }
  }


  public getTotalCountYesterday() {
    this.totalCountYesterDay = 0;
    const yesterdayDate = moment().subtract(1, 'days').startOf('day');
    this.leaf.assets.forEach(asset => {
      asset.series.forEach(serie => {
        if (moment(serie.timestamp).startOf('day').isSame(yesterdayDate)) {
          this.totalCountYesterDay += serie.valueIn;
        }
      });
    });
  }

  public getTotalSameDayLastWeek() {
    let totalCountSameDayLastWeek = 0;
    const sameDayLastWeek = moment().subtract(1, 'weeks').startOf('day');
    this.leaf.assets.forEach(asset => {
      asset.series.forEach(serie => {
        if (moment(serie.timestamp).startOf('day').isSame(sameDayLastWeek)) {
          totalCountSameDayLastWeek += serie.valueIn;
        }
      });
    });
    return totalCountSameDayLastWeek;
  }

  public getTotalCountLastWeek() {
    this.totalLastWeek = 0;
    const lastWeekStartDate = moment().subtract(1, 'weeks').startOf('isoWeek');
    const lastWeekEndDate = moment().subtract(1, 'weeks').endOf('isoWeek');
    this.leaf.assets.forEach(asset => {
      asset.series.forEach(serie => {
        if (moment(serie.timestamp).startOf('day').isSameOrAfter(lastWeekStartDate) && moment(serie.timestamp).startOf('day').isSameOrBefore(lastWeekEndDate)) {
          this.totalLastWeek += serie.valueIn;
        }
      });
    });
  }

  public getTotalCountWeekBeforeLastWeek(): number {
    let totalCountWeekBeforeLastWeek = 0;
    const WeekBeforelastWeekStartDate = moment().subtract(2, 'weeks').startOf('isoWeek');
    const WeekBeforelastWeekEndDate = moment().subtract(2, 'weeks').endOf('isoWeek');
    if ((this.leaf.assets || []).length) {
      this.leaf.assets.forEach(asset => {
        asset.series.forEach(serie => {
          if (moment(serie.timestamp).startOf('day').isSameOrAfter(WeekBeforelastWeekStartDate) && moment(serie.timestamp).startOf('day').isSameOrBefore(WeekBeforelastWeekEndDate)) {
            totalCountWeekBeforeLastWeek += serie.valueIn;
          }
        });
      });
    }
    return totalCountWeekBeforeLastWeek;
  }

  public getTempCountToday(): number {
    let tempCountToday = 0;
    const currentDate = moment().startOf('day');
    this.leaf.assets.forEach(asset => {
      asset.series.forEach(serie => {
        if (moment(serie.timestamp).startOf('day').isSame(currentDate)) {
          tempCountToday += serie.valueIn;

        }
      });
    });
    return tempCountToday;
  }

  public getDifferenceLastWeekAndWeekBefore(): string {
    this.differenceLastWeekAndWeekBefore = this.totalLastWeek - this.getTotalCountWeekBeforeLastWeek();
    return (this.totalLastWeek - this.getTotalCountWeekBeforeLastWeek()) > 0 ? "+" + (this.totalLastWeek - this.getTotalCountWeekBeforeLastWeek()).toString() : (this.totalLastWeek - this.getTotalCountWeekBeforeLastWeek()).toString();
  }

  public getDifferenceCurrentDayAndSameDayLastWeek(): string {
    this.differenceCurrentDayAndSameDayLastWeek = this.getTempCountToday() - this.getTotalSameDayLastWeek();
    return (this.getTempCountToday() - this.getTotalSameDayLastWeek()) > 0 ? "+" + (this.getTempCountToday() - this.getTotalSameDayLastWeek()).toString() : (this.getTempCountToday() - this.getTotalSameDayLastWeek()).toString();
  }

  private generateDummyData() {
    this.leaf.assets.forEach(element => {
      element.series = [];
      element.series.push({
          valueIn: 10,
          timestamp: moment().subtract(1,'hours').valueOf()
        }, {
          valueIn: 20,
          timestamp: moment().subtract(2,'hours').valueOf()
        }, {
          valueIn: 30,
          timestamp: moment().subtract(1, 'days').valueOf()
        }, {
          valueIn: 40,
          timestamp: moment().subtract(2, 'days').valueOf()
        }, {
          valueIn: 40,
          timestamp: moment().subtract(3, 'days').valueOf()
        }, {
          valueIn: 50,
          timestamp: moment().subtract(4, 'days').valueOf()
        }, {
          valueIn: 25,
          timestamp: moment().subtract(5, 'days').valueOf()
        }, {
          valueIn: 35,
          timestamp: moment().subtract(5, 'days').valueOf()
        }, {
          valueIn: 45,
          timestamp: moment().subtract(5, 'days').valueOf()
        }, {
          valueIn: 55,
          timestamp: moment().subtract(6, 'days').valueOf()
        }, {
          valueIn: 12,
          timestamp: moment().subtract(7, 'days').valueOf()
        }, {
          valueIn: 22,
          timestamp: moment().subtract(14, 'days').valueOf()
        }, {
          valueIn: 33,
          timestamp: moment().subtract(15, 'days').valueOf()
        }, {
          valueIn: 44,
          timestamp: moment().subtract(16, 'days').valueOf()
        }, {
          valueIn: 55,
          timestamp: moment().subtract(17, 'days').valueOf()
        }, {
          valueIn: 6,
          timestamp: moment().subtract(4, 'months').valueOf()
        }, {
          valueIn: 40,
          timestamp: moment().subtract(5, 'months').valueOf()
        }, {
          valueIn: 27,
          timestamp: moment().subtract(6, 'months').valueOf()
        }, {
          valueIn: 16,
          timestamp: moment().subtract(7, 'months').valueOf()
        }
      );
    });
  }

}
