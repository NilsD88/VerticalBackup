import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IWalkingTrailLocation } from 'src/app/models/walkingtrail/location.model';

import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import { MOCK_TOTAL_COUNT_PAST_WEEK } from 'src/app/mocks/walking-trail';

declare global {
  interface Window { moment: any; }
}

moment.locale('nl-be');
window.moment = moment;
mTZ();

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

@Component({
  selector: 'pvf-total-count-past-week',
  templateUrl: './total-count-past-week.component.html',
  styleUrls: ['./total-count-past-week.component.scss']
})
export class TotalCountPastWeekComponent implements OnInit, OnChanges {

  @Input() rootLocation: IWalkingTrailLocation;

  public chart: any;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    const options = {
      navigator: {
        enabled: true
      },
      time: {
        timezone: 'Europe/Brussels'
      },
      chart: {
        zoomType: 'xy',
        height: 400,
      },
      title: {
        text: ''
      },
      exporting: {
        csv: {
          dateFormat: '%d-%m-%Y %H:%M:%S',
        },
        enabled: true,
        filename: 'total-count-past-week'
      },
      credits: {
        enabled: false
      },
      tooltip: {
        crosshairs: true,
        shared: true,
      },
      yAxis: [],
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          day: '%a'
        }
      },
      plotOptions: {
        spline: {
            marker: {
                enabled: false
            }
        },
        series: {
          marker: {
            enabled: false
          }
        }
      },
      legend: {},
      series: []
    };

    let counter = 0;
    for (const thing of MOCK_TOTAL_COUNT_PAST_WEEK) {
      for (const sensor of thing.sensors) {
        options.yAxis.push({
          title: {
            text: 'Trail'
          },
          visible: false
        });
        options.series.push(
          {
            name: 'Trail',
            type: 'spline',
            yAxis: counter,
            data: sensor.series.map((serie) => {
              return [serie.timestamp, parseFloat(serie.sum.toFixed(2))];
            })
          }
        );
        counter++;
      }
    }

    console.log(options.series);


    try {
      this.chart = Highcharts.chart('chart-container', options);
    } catch (error) {
      options.series = [];
      this.chart = Highcharts.chart('chart-container', options);
      console.log(error);
    }
  }
}
