
import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import * as Highcharts from 'highcharts';

declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');
const exporting = require('highcharts/modules/exporting');
const exportData = require('highcharts/modules/export-data');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
exporting(Highcharts);
exportData(Highcharts);

@Component({
  selector: 'pvf-pie-day-chart',
  templateUrl: './pie-day-chart.component.html',
  styleUrls: ['./pie-day-chart.component.scss']
})
export class PieDayChartComponent implements OnInit {

  public options: any;

  @Input() public series = [];
  @Input() public title = '';


  constructor() {}

  ngOnInit() {
  
    this.options =  {
      chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
      },
      title: {
          text: this.title
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
          point: {
              valueSuffix: '%'
          }
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %'
              }
          }
      },
   series: [{
        data: this.series
      }]
  };
    Highcharts.chart('day-chart-container', this.options);
  }



}


