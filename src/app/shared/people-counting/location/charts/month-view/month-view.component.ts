import { SubSink } from 'subsink';
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
import { IPeopleCountingAsset } from 'src/app/models/peoplecounting/asset.model';
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { IFilterChartData } from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';

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
  selector: 'pvf-peoplecounting-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss']
})
export class MonthViewComponent implements OnInit, OnChanges, OnDestroy {

  @Input() leaf: IPeopleCountingLocation;
  @Input() assets: IPeopleCountingAsset[];
  @Input() assetUrl: string;
  @Input() assetService: WalkingTrailAssetService ;
  @Input() assetColors: string[];

  public chartData$ = new Subject<any>();
  public chartLoading = false;
  public loadingError = false;
  public chart: any;
  public chartOptions: any;
  public locale: string;
  public currentMonth;

  public currentFilter: IFilterChartData = {
    interval: 'DAILY',
    from: moment().subtract(1, 'months').date(1).set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
    to: moment().date(1).set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf()
  };

  private subs = new SubSink();

  constructor(
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef
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
      }
    );

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.assets) {
      if (changes.assets.currentValue && changes.assets.currentValue !== changes.assets.previousValue) {
        this.chartData$.next(this.currentFilter);
      }
    }
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
        marginBottom: 30,
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
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        y: 50,
        padding: 3,
        itemMarginTop: 5,
        itemMarginBottom: 5,
        itemStyle: {
          lineHeight: '14px'
        }
      },
    };
  }

  private initChart() {
    try {
      this.chart = Highcharts.chart('month-view-chart-container', this.chartOptions);
    } catch (error) {
      console.log(error);
    }
  }

  private updateChart(assets: IPeopleCountingAsset[]) {

    console.log(assets);
    this.currentMonth = moment(this.currentFilter.from).format('MMMM YY');
    this.chartOptions.series = [];
    this.chartOptions.xAxis.categories = [];

    const categories = [];
    const series = [];

    // Setting the categories
    for (let index = 0; index < 7; index++) {
      categories.push(moment().startOf('isoWeek').add(index, 'days').format('dddd'));
    }

    // Creating a dictionary between date and weekday/weeknumber
    const dateToWeek = [];
    const initialValue = [];
    let weekNumber = 1;
    let oldWeekday = 1;
    const daysInMonth = moment().subtract(1, 'months').date(1).daysInMonth();
    for (let index = 0; index < daysInMonth; index++) {
      initialValue.push(null);
      const weekDay = moment().subtract(1, 'months').date(index + 1).isoWeekday();
      if (weekDay < oldWeekday) {
        weekNumber++;
      }
      dateToWeek.push({
        weekNumber,
        weekDay,
        date: index + 1
      });
      oldWeekday = weekDay;
    }

    if ((assets || []).length) {
      // Generating asset colors
      const assetColors = this.assetColors || randomColor({
        count: assets.length
      });

      // Creating the data series by asset
      assets.forEach((asset, assetIndex) => {
        const assetName = asset.name;
        const assetInValues = cloneDeep(initialValue);
        const assetOutValues = cloneDeep(initialValue);

        for (const serie of asset.series) {
          const date = moment(serie.timestamp).date();
          assetInValues[date + 1] = serie.valueIn;
          assetOutValues[date + 1] = -serie.valueOut;
        }

        for (let index = 1; index <= weekNumber; index++) {
          const weekInValues = [null, null, null, null, null, null, null];
          const weekOutValues = [null, null, null, null, null, null, null];
          const dateToAdd = dateToWeek.filter(date => date.weekNumber === index);
          for (const date of dateToAdd) {
            weekInValues[date.weekDay - 1] = assetInValues[date.date];
            weekOutValues[date.weekDay - 1] = assetOutValues[date.date];
          }

          const NOT_DISPLAY_OUT = Math.abs(Math.min(...weekOutValues)) === 0;
          const NOT_DISPLAY_IN = Math.abs(Math.max(...weekInValues)) === 0;

          if (!NOT_DISPLAY_IN) {
            if (!NOT_DISPLAY_OUT) {
              series.push({
                name: `Week ${index} - ${assetName}`,
                color: assetColors[assetIndex],
                id: asset.id,
                data: weekInValues,
                stack: 'W' + index,
              });
              series.push({
                name: `Week ${index} - ${assetName} (OUT)`,
                color: assetColors[assetIndex],
                id: asset.id,
                data: weekOutValues,
                stack: 'W' + index,
                linkedTo: ':previous',
              });
            } else {
              series.push({
                name: `Week ${index} - ${assetName}`,
                color: assetColors[assetIndex],
                id: asset.id,
                data: weekInValues,
                stack: 'W' + index,
              });
            }
          } else {
            series.push({
              name: `Week ${index} - ${assetName}`,
              color: assetColors[assetIndex],
              id: asset.id,
              data: weekOutValues,
              stack: 'W' + index,
            });
          }
        }
      });
    }

    this.chartOptions.series = series;
    this.chartOptions.xAxis.categories = categories;
    this.chartLoading = false;

    try {
      this.chart = Highcharts.chart('month-view-chart-container', this.chartOptions);
    } catch (error) {
      this.chartOptions.series = [];
      this.chartOptions.xAxis.categories = [];
      this.chart = Highcharts.chart('month-view-chart-container', this.chartOptions);
      console.log(error);
    }
  }


  public swapPeriod(direction: boolean) {
    this.currentFilter.from = moment(this.currentFilter.from).subtract((direction) ? -1 : 1, 'months').valueOf();
    this.currentFilter.to = moment(this.currentFilter.to).subtract((direction) ? -1 : 1, 'months').valueOf();
    this.chartData$.next(this.currentFilter);
  }

  private getChartData(request: Observable<IFilterChartData>): Observable<IPeopleCountingAsset[]> {
    return request.pipe(
      debounceTime(500),
      switchMap(filter => {
        this.chartLoading = true;
        this.loadingError = false;
        this.changeDetectorRef.detectChanges();
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
