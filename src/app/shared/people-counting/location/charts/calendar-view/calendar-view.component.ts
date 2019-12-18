import { WalkingTrailLocationService } from './../../../../../services/walkingtrail/location.service';
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
  ChangeDetectorRef
} from '@angular/core';

import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import {
  TranslateService
} from '@ngx-translate/core';
import { svg } from 'leaflet';
import { Subject, Observable, of } from 'rxjs';
import { IFilterChartData } from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';
import { MatDialog } from '@angular/material';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { DialogComponent } from 'projects/ngx-proximus/src/lib/dialog/dialog.component';

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
export class CalendarViewComponent implements OnInit {

  @Input() leaf: IPeopleCountingLocation;
  @Input() locationService: WalkingTrailLocationService;

  public chartData$ = new Subject<any>();
  public chartLoading = false;
  public chart: any;
  public chartOptions: any;
  public locale: string;

  public startMonth: string;
  public endMonth: string;

  private svgElements: Highcharts.SVGElement [] = [];
  private numberOfMonths = 4;

  public currentFilter: IFilterChartData = {
    interval: 'DAILY',
    from: moment().subtract(this.numberOfMonths, 'months').date(1).set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
    to: moment().date(1).set({hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf()
  };

  constructor(
    private translateService: TranslateService,
    private dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef
  ) {}


  ngOnInit() {
    this.locale = this.translateService.currentLang;
    moment.locale(this.locale);
    window.moment = moment;
    mTZ();

    this.initChartOptions();
    this.initChart();
    this.getChartData(this.chartData$).subscribe(
      (locations: IPeopleCountingLocation[]) => {
        this.updateChart((locations[0] || {}).series);
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
        height: 250,
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
        this.changeDetectorRef.detectChanges();
        
        // MOCK DATA
        /*
        return new Observable <IPeopleCountingLocation[]> ((observer) => {
          const durationInMonths = +moment.duration(moment(this.currentFilter.to).diff(moment(this.currentFilter.from))).asMonths().toFixed(0);
          const differenceFromToday = +moment.duration(moment().diff(moment(this.currentFilter.from))).asMonths().toFixed(0);
          let series = [];
          for (let i = 0; i < durationInMonths; i++) {
            series = [
              ...series,
              ...generatePastMonthOfDataSeries(differenceFromToday-i)
            ];
          }
          observer.next(
            [{series}]
          );
        });
        */
        

        // REAL DATA
        return this.locationService.getLocationsDataByIds(
          [this.leaf.id],
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

}

function generatePastMonthOfDataSeries(pastIndex): IPeopleCountingLocationSerie[] {
  const dataSeries: IPeopleCountingLocationSerie[] = [];
  const daysInMonth = moment().subtract(pastIndex, 'months').date(1).daysInMonth();
  for (let index = 0; index < daysInMonth; index++) {
    dataSeries.push({
      timestamp: moment().subtract(pastIndex, 'months').date(1).add(index, 'days').valueOf(),
      valueIn: Math.floor(Math.random() * 101)
    });
  }
  return dataSeries;
}
