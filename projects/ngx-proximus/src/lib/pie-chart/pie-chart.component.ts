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
  selector: 'pxs-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, OnChanges {
  public options: any;
  @Input() public height;
  @Input() public series = [];
  @Input() public title = '';
  @Input() colors = [
    '#5C2D91', '#866C9D',
    '#B22E87', '#C386A9',
    '#EA4D71', '#F3A7B1',
    '#FF835B', '#9E6450',
    '#F9F871', '#C0BC84',
    '#9BDE7E', '#7FA06F'
  ];

  @Output() filter: EventEmitter<string>;

  constructor() {
    this.filter = new EventEmitter();
  }

  ngOnInit() {
    this.ngOnChanges();
  }

  public ngOnChanges() {
    this.options = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: this.height
      },
      title: {
        text: this.title
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          events: {
            click: (event) => {
              this.pieClicked(event);
            }
          }
        }
      },
      series: [{
        name: 'Tanks',
        colorByPoint: true,
        data: this.series
      }],
      exporting: {
        csv: {
          dateFormat: '%d-%m-%Y %H:%M:%S'
        },
        enabled: true
      },
      credits: {
        enabled: false
      },
      colors: this.colors,

      legend: {}
    };
    Highcharts.chart('chart-container', this.options);
  }

  public pieClicked(event) {
    this.filter.emit(event.point.name);
  }

}
