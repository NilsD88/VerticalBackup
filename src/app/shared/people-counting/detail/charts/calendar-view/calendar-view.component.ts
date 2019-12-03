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
  SimpleChanges,
  OnChanges
} from '@angular/core';

import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import {
  TranslateService
} from '@ngx-translate/core';
import {
  IPeopleCountingAssetSerie
} from 'src/app/models/peoplecounting/asset.model';
import { svg } from 'leaflet';

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
  selector: 'pvf-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit, OnChanges {

  @Input() leaf: IPeopleCountingLocation;

  public chart: any;
  public chartOptions: any;
  public locale: string;

  public startMonth: string;
  public endMonth: string;

  private startMonthIndex = 4;
  private endMonthIndex = 0;

  private svgElements: Highcharts.SVGElement [] = [];



  constructor(
    private translateService: TranslateService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart) {
      this.updateChart();
    }
  }

  ngOnInit() {
    this.locale = this.translateService.currentLang;
    moment.locale(this.locale);
    window.moment = moment;
    mTZ();

    this.initChartOptions();
    this.initChart();
    this.updateChart();
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

  private updateChart() {
    this.chartOptions.series = [];
    const startDate = moment().subtract(this.startMonthIndex, 'months').date(1);
    const endDate = moment().subtract(this.endMonthIndex, 'months').date(1);
    this.startMonth = startDate.format('MMMM YY');
    this.endMonth = endDate.format('MMMM YY');
    const firstWeekNumber = moment().subtract(this.startMonthIndex, 'months').date(1).isoWeek();
    let biggestWeekNumber = firstWeekNumber;
    for (let index = this.startMonthIndex; index > this.endMonthIndex; index--) {
      const firstDayOfMonth = moment().subtract(index, 'months').date(1);
      const weekNumber = firstDayOfMonth.isoWeek();
      const padding = Math.abs(4 - index + this.endMonthIndex) * 2;
      this.chartOptions.series.push({
        name: firstDayOfMonth.format('MMMM'),
        keys: ['x', 'y', 'value', 'week', 'date'],
        data: generatePastMonthOfDataSeries(index).map((serie) => {
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

    try {
      this.chart = Highcharts.chart('calendar-view-chart-container', this.chartOptions);
    } catch (error) {
      this.chartOptions.series = [];
      this.chart = Highcharts.chart('calendar-view-chart-container', this.chartOptions);
      console.log(error);
    }
  }

  public swapPeriod(direction: boolean) {
    this.startMonthIndex = (direction) ? this.startMonthIndex - 4 : this.startMonthIndex + 4;
    this.endMonthIndex = (direction) ? this.endMonthIndex - 4 : this.endMonthIndex + 4;
    this.updateChart();
  }

}

function generatePastMonthOfDataSeries(pastIndex): IPeopleCountingAssetSerie[] {
  const dataSeries: IPeopleCountingAssetSerie[] = [];
  const daysInMonth = moment().subtract(pastIndex, 'months').date(1).daysInMonth();
  for (let index = 0; index < daysInMonth; index++) {
    dataSeries.push({
      timestamp: moment().subtract(pastIndex, 'months').date(1).add(index, 'days').valueOf(),
      valueIn: Math.floor(Math.random() * 101)
    });
  }
  return dataSeries;
}
