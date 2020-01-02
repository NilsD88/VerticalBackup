import { SubSink } from 'subsink';
import { IPeopleCountingLocationSerie } from './../../../../../models/peoplecounting/location.model';
import { WalkingTrailAssetService } from 'src/app/services/walkingtrail/asset.service';
import {
  cloneDeep
} from 'lodash';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ChangeDetectorRef,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import {
  TranslateService
} from '@ngx-translate/core';

import * as randomColor from 'randomcolor';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { IPeopleCountingAsset, IPeopleCountingAssetSerie } from 'src/app/models/peoplecounting/asset.model';
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { DialogComponent } from 'projects/ngx-proximus/src/lib/dialog/dialog.component';
import { IFilterChartData } from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';
import { allIntervalBetween } from 'src/app/shared/utils';
import {uniqBy, orderBy} from 'lodash';

declare global {
  interface Window {
    moment: any;
  }
}


declare var require: any;
require('highcharts/modules/boost');
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/no-data-to-display')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

@Component({
  selector: 'pvf-peoplecounting-stacked-column',
  templateUrl: './stacked-column.component.html',
  styleUrls: ['./stacked-column.component.scss']
})
export class StackedColumnComponent implements OnInit, OnChanges, OnDestroy {

  @Input() leaf: IPeopleCountingLocation;
  @Input() assets: IPeopleCountingAsset[];
  @Input() assetUrl: string;
  @Input() assetService: WalkingTrailAssetService ;
  @Input() assetColors: string[];

  public chartData$ = new Subject<any>();
  public chartLoading = false;
  public chart: any;
  public chartOptions: any;
  public locale: string;

  public periodValue = 'day';
  public currentFilter: IFilterChartData = {
    interval: 'HOURLY',
    from: moment().subtract(1, 'days').set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
    to: moment().add(1, 'days').set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf()
  };

  private subs = new SubSink();

  constructor(
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {}


  ngOnInit() {
    this.locale = this.translateService.currentLang;
    moment.locale(this.locale + '-be');
    window.moment = moment;
    mTZ();

    this.initChartOptions();
    this.initChart();
    this.subs.sink = this.getChartData(this.chartData$).subscribe(
      (assets: IPeopleCountingAsset[]) => {
        this.updateChart(assets);
      }
    );

  }

  public periodOnChange(event = null) {
    const value = (event || {}).value || null;
    this.periodValue = value || 'day';
    switch (value) {
      case 'day':
        this.getDayValue();
        break;
      case 'week':
        this.getWeekValue();
        break;
      case 'month':
        this.getMonthValues();
        break;
      case 'year':
        this.getYearValues();
        break;
      default:
        this.getDayValue();
        break;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.assets) {
      if (changes.assets.currentValue && changes.assets.currentValue !== changes.assets.previousValue) {
        this.periodOnChange();
      }
    }
  }


  getYearValues() {
    this.currentFilter = {
      interval: 'MONTHLY',
      from: moment().subtract(1, 'years').date(1).set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
      to: moment().add(1, 'months').date(1).set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf()
    };
    this.chartData$.next(this.currentFilter);
  }

  getMonthValues() {
    this.currentFilter = {
      interval: 'DAILY',
      from: moment().subtract(1, 'months').set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
      to: moment().add(1, 'days').set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf()
    };
    this.chartData$.next(this.currentFilter);
  }

  getWeekValue() {
    this.currentFilter = {
      interval: 'DAILY',
      from: moment().subtract(1, 'weeks').set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
      to: moment().add(1, 'days').set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf()
    };
    this.chartData$.next(this.currentFilter);
  }

  getDayValue() {
    this.currentFilter = {
      interval: 'HOURLY',
      from: moment().subtract(1, 'days').set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
      to: moment().add(1, 'days').set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf()
    };
    this.chartData$.next(this.currentFilter);
  }



  private initChartOptions() {
    Highcharts.setOptions({
      lang: {
        weekdays: moment.weekdays(),
        shortWeekdays: moment.weekdaysShort()
      }
    });

    this.chartOptions = {
      chart: {
        type: 'column',
        marginBottom: 100,
        zoomType: 'x'
      },
      title: '',
      exporting: {
        csv: {
          dateFormat: '%d-%m-%Y %H:%M:%S',
        },
        enabled: true,
        filename: 'count-past-year',
      },
      credits: {
        enabled: false
      },
      tooltip: {
        crosshairs: true,
        shared: true,
      },
      xAxis: {
        categories: [],
      },
      yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
          text: '',
        }
      },
      plotOptions: {
        column: {
          stacking: 'normal'
        }
      },
      series: [],
    };
  }

  private initChart() {
    try {
      this.chart = Highcharts.chart('store-stacked-column-counter', this.chartOptions);
    } catch (error) {
      console.log(error);
    }
  }

  private updateChart(assets: IPeopleCountingAsset[]) {
    this.chartOptions.series = [];
    this.chartOptions.xAxis.categories = [];
    const categories = [];
    const series = [];

    let allIntervals: IPeopleCountingLocationSerie[];
    switch (this.currentFilter.interval) {
      case 'DAILY':
        allIntervals = allIntervalBetween(this.currentFilter.from, this.currentFilter.to, 'days');
        allIntervals.forEach(serie => {
          categories.push(moment(serie.timestamp).format('DD/MM/YY'));
        });
        break;
      case 'HOURLY':
        allIntervals = allIntervalBetween(this.currentFilter.from, this.currentFilter.to, 'hours');
        allIntervals.forEach(serie => {
          categories.push(moment(serie.timestamp).format('HH:MM'));
        });
        break;
      case 'MONTHLY':
        allIntervals = allIntervalBetween(this.currentFilter.from, this.currentFilter.to, 'months');
        allIntervals.forEach(serie => {
          categories.push(moment(serie.timestamp).format('MMM YY'));
        });
        break;
      default:
        allIntervals = allIntervalBetween(this.currentFilter.from, this.currentFilter.to, 'days');
        allIntervals.forEach(serie => {
          categories.push(moment(serie.timestamp).format('DD/MM/YY'));
        });
        break;
    }

    const assetColors = this.assetColors || randomColor({
      count: assets.length
    });

    if ((assets || []).length) {
      assets.forEach((asset, assetIndex) => {
        // TODO: remove these lines when the backend will send all the timestamp between the period
        const rawSeries = asset.series;
        const concat = rawSeries.concat(allIntervals);
        const uniq = uniqBy(concat, (serie) => serie.timestamp);
        const allSeries = orderBy(uniq, ['timestamp'], ['asc']);

        series.push({
          name: asset.name,
          data: allSeries.map(x => x.valueIn),
          color: assetColors[assetIndex],
        });
      });
    }

    this.chartOptions.series = series;
    this.chartOptions.xAxis.categories = categories;
    this.chartLoading = false;

    try {
      this.chart = Highcharts.chart('store-stacked-column-counter', this.chartOptions);
    } catch (error) {
      this.chartOptions.series = [];
      this.chartOptions.xAxis.categories = [];
      this.chart = Highcharts.chart('store-stacked-column-counter', this.chartOptions);
      console.log(error);
    }
  }


  private getChartData(request: Observable<IFilterChartData>): Observable<IPeopleCountingAsset[]> {
    return request.pipe(
      debounceTime(500),
      switchMap(filter => {
        this.chartLoading = true;
        this.changeDetectorRef.detectChanges();

        // REAL DATA
        return this.assetService.getAssetsDataByIds(
          this.assets.map(asset => asset.id),
          filter.interval, filter.from, filter.to
        ).pipe(catchError(() => {
          this.dialog.open(DialogComponent, {
            data: {
              title: 'Sorry, an error has occured!',
              message: 'An error has occured during getting the sensor data'
            },
            minWidth: '320px',
            maxWidth: '400px',
            width: '100vw',
            maxHeight: '80vh',
          });
          return of([]);
        }));
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}

