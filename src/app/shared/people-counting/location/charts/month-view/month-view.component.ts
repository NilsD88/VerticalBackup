import { WalkingTrailAssetService } from 'src/app/services/walkingtrail/asset.service';
import {
  cloneDeep
} from 'lodash';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ChangeDetectorRef
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
export class MonthViewComponent implements OnInit {

  @Input() leaf: IPeopleCountingLocation;
  @Input() assetService: WalkingTrailAssetService ;

  public chartData$ = new Subject<any>();
  public chartLoading = false;
  public chart: any;
  public chartOptions: any;
  public locale: string;

  public currentMonth;
  public currentFilter: IFilterChartData = {
    interval: 'DAILY',
    from: moment().subtract(1, 'months').date(1).set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
    to: moment().date(1).set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf()
  };

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
    this.getChartData(this.chartData$).subscribe(
      (assets: IPeopleCountingAsset[]) => {
        this.updateChart(assets);
      }
    );
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

    if (!this.leaf) {
      return;
    }

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
      const assetColors = randomColor({
        count: assets.length
      });

      // Creating the data series by asset
      assets.forEach((asset, assetIndex) => {
        const assetName = asset.name;
        const assetValues = cloneDeep(initialValue);

        for (const serie of asset.series) {
          const date = moment(serie.timestamp).date();
          assetValues[date + 1] = serie.valueIn;
        }

        for (let index = 1; index <= weekNumber; index++) {
          const weekValues = [null, null, null, null, null, null, null];
          const dateToAdd = dateToWeek.filter(date => date.weekNumber === index);
          for (const date of dateToAdd) {
            weekValues[date.weekDay - 1] = assetValues[date.date];
          }
          series.push({
            name: `Week ${index} - ${assetName}`,
            color: assetColors[assetIndex],
            id: asset.id,
            data: weekValues,
            stack: 'W' + index,
          });
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
        this.changeDetectorRef.detectChanges();
        return new Observable <IPeopleCountingAsset[]> ((observer) => {
          const assets: IPeopleCountingAsset[] = [];
          this.leaf.assets.forEach(asset => {
              const durationInMonths = moment.duration(moment().diff(moment(this.currentFilter.from))).asMonths().toFixed(0);
              assets.push({
                id: asset.id,
                name: asset.name,
                series: generateMonthOfDataSeries(
                  +durationInMonths
                )
              });
          });
          observer.next(assets);
        });
        /*
        return this.assetService.getAssetsDataByIds(
          this.leaf.assets.map(asset => asset.id),
          filter.interval, filter.from, filter.to
        ).pipe(catchError(() => {
          this.dialog.open(DialogComponent, {
            data: {
              title: 'Sorry, an error has occured!',
              message: 'An error has occured during getting the sensor data'
            }
          });
          return of([]);
        }));
        */
      })
    );
  }


}




function generateMonthOfDataSeries(monthIndex: number): IPeopleCountingAssetSerie[] {
  const dataSeries: IPeopleCountingAssetSerie[] = [];
  const daysInMonth = moment().subtract(monthIndex, 'months').date(1).daysInMonth();
  for (let index = 0; index < daysInMonth; index++) {
    dataSeries.push(
      {
        timestamp: moment().subtract(monthIndex, 'months').date(1).add(index, 'days').valueOf(),
        valueIn: Math.floor(Math.random() * 101)
      }
    );
  }
  return dataSeries;
}
