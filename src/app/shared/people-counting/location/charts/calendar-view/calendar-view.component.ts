import { PeopleCountingRetailLocationService } from './../../../../../services/peoplecounting-retail/location.service';
import { SubSink } from 'subsink';
import {
  isNullOrUndefined
} from 'util';
import {
  IPeopleCountingLocation,
  IPeopleCountingLocationSerie
} from 'src/app/models/peoplecounting/location.model';
import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';

import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import {
  TranslateService
} from '@ngx-translate/core';
import { Subject, Observable, of } from 'rxjs';
import { IFilterChartData } from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import {uniqBy, orderBy} from 'lodash';
import { allIntervalBetween } from 'src/app/shared/utils';
import { StairwayToHealthLocationService } from 'src/app/services/stairway-to-health/location.service';

declare global {
  interface Window {
    moment: any;
  }
}


declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');
const exporting = require('highcharts/modules/exporting');
const exportData = require('highcharts/modules/export-data');

const Highcharts = require('highcharts/highstock');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
exporting(Highcharts);
exportData(Highcharts);

require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/series-label')(Highcharts);

@Component({
  selector: 'pvf-peoplecounting-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit, OnDestroy {

  @Input() leaf: IPeopleCountingLocation;
  @Input() locationService: PeopleCountingRetailLocationService | StairwayToHealthLocationService;

  public chartData$ = new Subject<any>();
  public chartLoading = false;
  public loadingError = false;
  public chart: any;
  public chartOptions: any;
  public locale: string;
  public startMonth: string;
  public endMonth: string;

  private svgElements: Highcharts.SVGElement [] = [];
  private numberOfMonths = 4;
  private subs = new SubSink();

  public currentFilter: IFilterChartData = {
    interval: 'DAILY',
    from: moment().subtract(this.numberOfMonths, 'months').date(1).set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
    to: moment().date(1).set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf()
  };

  constructor(
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}


  ngOnInit() {
    this.locale = this.translateService.currentLang;
    moment.locale(this.locale);
    window.moment = moment;
    mTZ();

    this.initChartOptions();
    this.initChart();
    this.subs.sink = this.getChartData(this.chartData$).subscribe(
      (locations: IPeopleCountingLocation[]) => {
        console.log('getChartData subscribe')
        if (!this.loadingError) {
          this.updateChart((locations[0] || {}).series);
        }
      }
    );
    this.chartData$.next(this.currentFilter);
  }

  private initChartOptions() {

    const instance = this;

    Highcharts.setOptions({
      lang: {
        weekdays: moment.weekdays(),
        shortWeekdays: moment.weekdaysShort()
      }
    });

    const weekdaysShorts = moment.weekdaysShort();
    weekdaysShorts.push(weekdaysShorts.shift());

    this.chartOptions = {
      time: {
        timezone: 'Europe/Brussels'
      },
      chart: {
        type: 'heatmap',
        plotBorderWidth: 0,
        marginTop: 50,
        marginBottom: 40,
        events: {
          render: function () {
            const series = this.series;
            let bbox;

            if(instance.svgElements.length) {
              instance.svgElements.forEach(svgElement => {
                svgElement.destroy();
              });
              instance.svgElements = [];
            }

            series.forEach(function(s) {
              bbox = s.group.getBBox(true);
              instance.svgElements.push(this.renderer.text(
                  s.name,
                  bbox.x + this.plotLeft + bbox.width / 2,
                  bbox.y + this.plotTop - 10
                )
                .attr({
                  align: 'center'
                })
                .css({
                  color: '#666666',
                  fontSize: '11px'
                })
                .add());
            }, this);
          }
        }
      },
      title: {
        text: ''
      },
      exporting: {
        csv: {
          dateFormat: '%d-%m-%Y %H:%M:%S',
        },
        enabled: true,
        filename: 'calendar-view',
      },
      credits: {
        enabled: false
      },

      xAxis: {
        type: 'category',
        title: null,
        lineWidth: 0,
        gridLineWidth: 0,
        minorGridLineWidth: 0,
        tickWidth: 0,
        opposite: true,
        labels: {
          enabled: false
        }
      },

      yAxis: {
        type: 'category',
        categories: weekdaysShorts,
        title: null,
        reversed: true,
        lineWidth: 0,
        gridLineWidth: 0,
        minorGridLineWidth: 0,
        minTickInterval: 1,
        labels: {
          style: {
            fontSize: '9px'
          }
        },
      },


      colorAxis: {
        tickInterval: 1,
        tickmarkPlacement: 'on',
        labels: {
          enabled: true
        }
      },

      legend: {
        enabled: false,
        verticalAlign: 'bottom',
        layout: 'horizontal',
        margin: 30,
        y: 40
      },


      tooltip: {
        useHTML: true,
        formatter: function () {
          if (!isNullOrUndefined(this.point.value)) {
            return `
              ${Highcharts.dateFormat('%a %e. %B %Y', this.point.date)}
              <br><div>Value: ${this.point.value} </div>
            `;
          } else {
            return false;
          }
        }
      },

      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            y: 20,
            crop: false,
            overflow: 'allow',
            formatter: function () {
              if (this.point.y == 6 || this.point.y == 16)
                return this.point.week;
              else
                return null;
            },
            style: {
              fontSize: '9px',
              color: '#999999',
              fontWeight: 'normal',
              textOutline: 'none'
            }
          },
          borderColor: '#ffffff',
          borderWidth: 3
        }
      },
      series: []
    };
  }

  private initChart() {
    try {
      this.chart = Highcharts.chart('calendar-view-chart-container', this.chartOptions);
    } catch (error) {
      console.log(error);
    }
  }

  private updateChart(series: IPeopleCountingLocationSerie[]) {
    this.chartOptions.series = [];
    this.startMonth = moment(this.currentFilter.from).format('MMMM YY');
    this.endMonth = moment(this.currentFilter.to).subtract(1, 'day').format('MMMM YY');

    if (!series) {
      return this.displayChart();
    }

    // TODO: remove these lines when the backend will send all the timestamp between the period
    const concat = series.concat(allIntervalBetween(this.currentFilter.from, this.currentFilter.to, 'days'));
    const uniq = uniqBy(concat, (serie) => serie.timestamp);
    series = orderBy(uniq, ['timestamp'], ['asc']);

    const firstWeekNumber = moment(this.currentFilter.from).date(1).isoWeek();
    let biggestWeekNumber = firstWeekNumber;
    const durationInMonths = +moment.duration(moment(this.currentFilter.to).diff(moment(this.currentFilter.from))).asMonths().toFixed(0);
    for (let index = durationInMonths; index > 0; index--) {
      const firstDayOfMonth = moment(this.currentFilter.from).subtract(index - durationInMonths, 'months').date(1);
      const currentMonthName = firstDayOfMonth.format('MMMM');
      const weekNumber = firstDayOfMonth.isoWeek();
      const padding = Math.abs(durationInMonths - index) * 2;
      this.chartOptions.series.push({
        name: currentMonthName,
        keys: ['x', 'y', 'value', 'week', 'date'],
        data: series.filter(serie => moment(serie.timestamp).format('MMMM') === currentMonthName).map((serie) => {
          const date = moment(serie.timestamp);
          let currentWeekNumber = date.isoWeek();
          if (currentWeekNumber < biggestWeekNumber) {
            currentWeekNumber += biggestWeekNumber;
          } else {
            biggestWeekNumber = currentWeekNumber;
          }
          return [
            (currentWeekNumber - firstWeekNumber + padding),
            (date.isoWeekday() - 1),
            serie.valueIn,
            (date.isoWeek() - weekNumber + 1),
            serie.timestamp
          ];
        })
      });
    }
    this.displayChart();
  }

  private displayChart() {
    this.chartLoading = false;
    try {
      this.chart = Highcharts.chart('calendar-view-chart-container', this.chartOptions);
    } catch (error) {
      this.chartOptions.series = [];
      this.chart = Highcharts.chart('calendar-view-chart-container', this.chartOptions);
      console.log(error);
    }
  }

  public swapPeriod(direction: boolean) {
    this.currentFilter.from = moment(this.currentFilter.from).subtract((direction) ? -this.numberOfMonths : this.numberOfMonths, 'months').valueOf();
    this.currentFilter.to = moment(this.currentFilter.to).subtract((direction) ? -this.numberOfMonths : this.numberOfMonths, 'months').valueOf();
    this.chartData$.next(this.currentFilter);
  }

  private getChartData(request: Observable<IFilterChartData>): Observable<IPeopleCountingLocation[]> {
    return request.pipe(
      debounceTime(500),
      switchMap(filter => {
        this.chartLoading = true;
        this.loadingError = false;
        this.changeDetectorRef.detectChanges();
        // REAL DATA
        return this.locationService.getLocationsDataByIds(
          [this.leaf.id],
          filter.interval, filter.from, filter.to
        ).pipe(catchError(() => {
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
