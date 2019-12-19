
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

  @Output() filter: EventEmitter<string[]> = new EventEmitter();

  constructor() {}

  ngOnInit() {
    const filter = this.filter;
    this.options = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: this.height,
        backgroundColor: '#f5f5f5',
      },
      title: {
        text: this.title
      },
      plotOptions: {
        pie: {
          cursor: 'pointer',
          dataLabels: {
              enabled: false
          },
          showInLegend: true,
        },
        series: {
          point: {
            events: {
              click: function (event) {
                this.slice(null);
                this.select(null, true);
                const points = this.series.points;
                const selected = this.series.chart.getSelectedPoints();
                if (selected.length) {
                  const selectedNames = [];
                  points.forEach(element => {
                    element.color = changeRgbaColorOpacity(element.color, 0.3);
                  });
                  selected.forEach(element => {
                    selectedNames.push(element.keyName);
                    element.color = changeRgbaColorOpacity(element.color, 1);
                  });
                  filter.emit(selectedNames);
                } else {
                  const selectedNames = [];
                  points.forEach(element => {
                    selectedNames.push(element.keyName);
                    element.color = changeRgbaColorOpacity(element.color, 1);
                  });
                  filter.emit(selectedNames);
                }
                this.series.redraw();
              }
            },
          },
          states: {
            selected: {
              opacity: 1
            },
            normal: {
              opacity: 0.5
            },
            inactive: {
              opacity: 0.2
            }
          },
        }
      },
      series: [{
        data: this.series
      }],
      exporting: {
        enabled: false,
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
    /*
    this.filter.emit(event.point.name);
    */
  }

}

function changeRgbaColorOpacity(rgba: string, alpha: number) {
  const index = rgba.lastIndexOf(',') + 1;
  const result = rgba.substring(0, index) + alpha + ')';
  return result;

}
