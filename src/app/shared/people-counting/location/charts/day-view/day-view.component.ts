import { Router } from '@angular/router';
import { Stairway2HealthAssetService } from './../../../../../services/stairway-2-health/asset.service';
import { SmartCountingAssetService } from './../../../../../services/smart-counting/asset.service';
import { SubSink } from 'subsink';
import { IPeopleCountingLocationSerie } from './../../../../../models/peoplecounting/location.model';
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


import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { IPeopleCountingAsset } from 'src/app/models/peoplecounting/asset.model';
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { IFilterChartData } from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';
import { allIntervalBetween, generatePxsGradientColor } from 'src/app/shared/utils';
import { HIGHCHARTS_MENU_ITEMS } from 'src/app/shared/global';

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
  selector: 'pvf-peoplecounting-day-view',
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.scss']
})
export class DayViewComponent implements OnInit, OnChanges, OnDestroy {

  @Input() leaf: IPeopleCountingLocation;
  @Input() assets: IPeopleCountingAsset[];
  @Input() assetUrl: string;
  @Input() assetService: SmartCountingAssetService | Stairway2HealthAssetService;
  @Input() assetColors: string[];

  public chartData$ = new Subject<any>();
  public chartLoading = false;
  public loadingError = false;
  public chart: any;
  public chartOptions: any;
  public locale: string;

  public periodValue = 'day';
  public currentFilter: IFilterChartData = {
    interval: 'HOURLY',
    from: moment().subtract(1, 'days').startOf('day').valueOf(),
    to: moment().endOf('day').valueOf()
  };

  private subs = new SubSink();

  constructor(
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
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
        if (!this.loadingError) {
          this.updateChart(assets);
        }
      },
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
      from: moment().subtract(1, 'years').startOf('month').valueOf(),
      to: moment().endOf('month').valueOf()
    };
    this.chartData$.next(this.currentFilter);
  }

  getMonthValues() {
    this.currentFilter = {
      interval: 'DAILY',
      from: moment().subtract(1, 'months').startOf('day').valueOf(),
      to: moment().endOf('day').valueOf()
    };
    this.chartData$.next(this.currentFilter);
  }

  getWeekValue() {
    this.currentFilter = {
      interval: 'DAILY',
      from: moment().subtract(1, 'weeks').startOf('day').valueOf(),
      to: moment().endOf('day').valueOf()
    };
    this.chartData$.next(this.currentFilter);
  }

  getDayValue() {
    this.currentFilter = {
      interval: 'HOURLY',
      from: moment().subtract(1, 'days').startOf('day').valueOf(),
      to: moment().endOf('day').valueOf()
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
        zoomType: 'x',
      },
      title: '',
      exporting: {
        csv: {
          dateFormat: '%d-%m-%Y %H:%M:%S',
        },
        enabled: true,
        filename: 'count-past-year',
        buttons: {
          contextButton: {
            menuItems: HIGHCHARTS_MENU_ITEMS
          }
        }
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
        title: {
          text: '',
        }
      },
      plotOptions: {
        column: {
          stacking: 'normal'
        },
        series: {
          point: {
            events: {
              click: (event) => {
                try {
                  const assetId = event.point.series.options.id;
                  this.router.navigateByUrl(`${this.assetUrl}${assetId}`);
                } catch (error) {
                  console.error(error);
                }
              }
            }
          }
        }
      },
      series: [],
    };
  }

  private initChart() {
    try {
      this.chart = Highcharts.chart('day-view-chart-container', this.chartOptions);
    } catch (error) {
      console.error(error);
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

    const assetColors = this.assetColors || generatePxsGradientColor(assets.length);

    if ((assets || []).length) {
      assets.forEach((asset, assetIndex) => {
        const assetName = asset.name;
        const inValues = asset.series.map(x => x.valueIn);
        const outValues = asset.series.map(x => -x.valueOut);
        const NOT_DISPLAY_OUT = Math.abs(Math.min(...outValues)) === 0;
        const NOT_DISPLAY_IN = Math.abs(Math.max(...inValues)) === 0;

        if (!NOT_DISPLAY_IN) {
          if (!NOT_DISPLAY_OUT) {
            series.push({
              name: `${assetName}`,
              color: assetColors[assetIndex],
              id: asset.id,
              data: inValues,
            });
            series.push({
              name: `${assetName} (OUT)`,
              color: assetColors[assetIndex],
              id: asset.id,
              data: outValues,
              linkedTo: ':previous',
            });
          } else {
            series.push({
              name: `${assetName}`,
              color: assetColors[assetIndex],
              id: asset.id,
              data: inValues,
            });
          }
        } else {
          series.push({
            name: `${assetName}`,
            color: assetColors[assetIndex],
            id: asset.id,
            data: outValues,
          });
        }
      });
    }

    this.chartOptions.series = series;
    this.chartOptions.xAxis.categories = categories;
    this.chartLoading = false;



    try {
      this.chart = Highcharts.chart('day-view-chart-container', this.chartOptions);
    } catch (error) {
      this.chartOptions.series = [];
      this.chartOptions.xAxis.categories = [];
      this.chart = Highcharts.chart('day-view-chart-container', this.chartOptions);
      console.error(error);
    }
  }


  private getChartData(request: Observable<IFilterChartData>): Observable<IPeopleCountingAsset[]> {
    return request.pipe(
      debounceTime(500),
      switchMap(filter => {
        this.chartLoading = true;
        this.loadingError = false;
        this.changeDetectorRef.detectChanges();
        // REAL DATA
        return this.assetService.getAssetsDataByIds(
          this.assets.map(asset => asset.id),
          filter.interval, filter.from, filter.to
        ).pipe(catchError((error) => {
          console.error(error);
          this.chartLoading = false;
          this.loadingError = true;
          return of([]);
        }));
      })
    );
  }

  public tryAgain() {
    this.chartData$.next(this.currentFilter);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}

