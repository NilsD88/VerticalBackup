import {PeopleCountingRetailLocationService} from './../../../../../services/peoplecounting-retail/location.service';
import {SubSink} from 'subsink';
import {isNullOrUndefined} from 'util';
import {IPeopleCountingLocation, IPeopleCountingLocationSerie} from 'src/app/models/peoplecounting/location.model';
import {ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';

import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import {TranslateService} from '@ngx-translate/core';
import {Observable, of, Subject, from} from 'rxjs';
import {IFilterChartData} from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';
import {catchError, debounceTime, switchMap} from 'rxjs/operators';
import {StairwayToHealthLocationService} from 'src/app/services/stairway-to-health/location.service';
import {cloneDeep} from 'lodash';
import { DecimalPipe } from '@angular/common';
import { HIGHCHARTS_MENU_ITEMS } from 'src/app/shared/global';

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
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/series-label')(Highcharts);

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
exporting(Highcharts);
exportData(Highcharts);

@Component({
  selector: 'pvf-peoplecounting-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit, OnChanges, OnDestroy {

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
    private changeDetectorRef: ChangeDetectorRef,
    private decimalPipe: DecimalPipe,
  ) {
  }


  ngOnInit() {
    this.locale = this.translateService.currentLang;
    moment.locale(this.locale);
    window.moment = moment;
    mTZ();

    this.initChartOptions();
    this.initChart();
    this.getAllData();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.leaf) {
      if (changes.leaf.currentValue && changes.leaf.currentValue !== changes.leaf.previousValue) {
        this.getAllData();
      }
    }
  }

  private getAllData() {
    this.subs.sink = this.getChartData(this.chartData$).subscribe(
      (locations: IPeopleCountingLocation[]) => {
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
    weekdaysShorts.push(weekdaysShorts[0]);

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
          render() {
            const series = this.series;
            let bbox;

            if (instance.svgElements.length) {
              instance.svgElements.forEach(svgElement => {
                svgElement.destroy();
              });
              instance.svgElements = [];
            }

            series.forEach((s) => {
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
        buttons: {
          contextButton: {
            menuItems: HIGHCHARTS_MENU_ITEMS
          }
        }
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
        formatter() {
          if (!isNullOrUndefined(this.point.value)) {
            return `
              ${moment(this.point.date).format('DD/MM/YYYY')}
              <br><div>${instance.translateService.instant('GENERAL.VALUE')}: ${instance.decimalPipe.transform(this.point.value, '1.0-2','fr-FR')} </div>
            `;
          } else {
            return `
              ${moment(this.point.date).format('DD/MM/YYYY')}
              <br><div>${instance.translateService.instant('GENERAL.VALUE')}: null </div>
            `;
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
            formatter() {
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
      console.error(error);
    }
  }

  private updateChart(series: IPeopleCountingLocationSerie[]) {
    this.chartOptions.series = [];
    this.startMonth = moment(this.currentFilter.from).format('MMMM YYYY');
    this.endMonth = moment(this.currentFilter.to).subtract(1, 'day').format('MMMM YYYY');

    if (!series) {
      return this.displayChart();
    }

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
            (date.isoWeekday()),
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
      console.log(cloneDeep(this.chartOptions));
      this.chart = Highcharts.chart('calendar-view-chart-container', this.chartOptions);
    } catch (error) {
      this.chartOptions.series = [];
      this.chart = Highcharts.chart('calendar-view-chart-container', this.chartOptions);
      console.error(error);
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
