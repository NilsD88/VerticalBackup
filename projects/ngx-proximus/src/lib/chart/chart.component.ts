import {AfterContentInit, Component, Input, OnChanges, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import {TranslateService} from '@ngx-translate/core';

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
  selector: 'pxs-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() chartData: {
    label: string;
    series: { label: string, avg: number, min: number, max: number }[]
  }[];


  @Input() height = 700;
  @Input() title = '';
  @Input() numeralValueFormatter = '';
  @Input() colors = [
    '#5C2D91', '#866C9D',
    '#B22E87', '#C386A9',
    '#EA4D71', '#F3A7B1',
    '#FF835B', '#9E6450',
    '#F9F871', '#C0BC84',
    '#9BDE7E', '#7FA06F'
  ];

  public options: any;

  constructor(public translateService: TranslateService) {
  }

  public ngOnInit() {
  }

  public async ngOnChanges() {
    this.options = {
      chart: {
        zoomType: 'xy',
        height: this.height
      },
      rangeSelector: {
        selected: 4
      },
      title: {
        text: this.title
      },
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
      tooltip: {
        crosshairs: true,
        shared: true
      },
      yAxis: [{ // Temperature yAxis
        opposite: false,
        showEmpty: false,
        title: {
          text: 'Temperature'
        },
        softMin: 0,
        softMax: 40
      }, { // humidity yAxis
        opposite: true,
        showEmpty: false,
        title: {
          text: 'Humidity'
        },
        softMin: 0,
        softMax: 100
      }, { // Luminosity yAxis
        opposite: false,
        showEmpty: false,
        title: {
          text: 'Luminosity'
        },
        softMin: 0,
        softMax: 500
      }, { // motion yAxis
        opposite: true,
        showEmpty: false,
        title: {
          text: 'Motion'
        },
        softMin: 0,
        softMax: 1000
      }],
      xAxis: {
        type: 'datetime'
      },
      legend: {},
      series: []
    };

    const chartDataPromises = [];
    const rangeTranslation = await new Promise((resolve) => {
      this.translateService.get('SENSORTYPES.range').subscribe((result) => {
        resolve(result);
      });
    });

    this.chartData.forEach(async (item) => {
      chartDataPromises.push(new Promise(async (resolveChartDataPromise) => {
        const labelTranslation = await new Promise((resolve) => {
          this.translateService.get('SENSORTYPES.' + item.label).subscribe((result) => {
            resolve(result);
          });
        });

        this.options.series.push({
          name: labelTranslation,
          yAxis: this.getYAxisByLabel(item.label),
          zIndex: 1,
          data: item.series.map((serie) => {
            let label = this.filterInt(serie.label);
            if (isNaN(label)) {
              console.warn('Unable to perse timestamp for chart, using default value of 0');
              label = 0;
            }
            return [label, parseFloat(serie.avg.toFixed(2))];
          })
        });
        this.options.series.push({
          name: labelTranslation + ' ' + rangeTranslation,
          type: 'arearange',
          yAxis: this.getYAxisByLabel(item.label),
          lineWidth: 0,
          linkedTo: ':previous',
          fillOpacity: 0.3,
          zIndex: 0,
          marker: {
            enabled: false
          },
          data: item.series.map((serie) => {
            let label = this.filterInt(serie.label);
            if (isNaN(label)) {
              console.warn('Unable to perse timestamp for chart, using default value of 0');
              label = 0;
            }
            return [label, parseFloat(serie.min.toFixed(2)), parseFloat(serie.max.toFixed(2))];
          })
        });

        resolveChartDataPromise();
      }));
    });

    await Promise.all(chartDataPromises);

    Highcharts.chart('chart-container', this.options);

  }

  public filterInt(value: string) {
    if (/^(-|\+)?(\d+|Infinity)$/.test(value)) {
      return Number(value);
    }
    return NaN;
  }

  getYAxisByLabel(label: string) {
    switch (label) {
      case 'temperature':
        return 0;
      case 'humidity':
        return 1;
      case 'luminosity':
        return 2;
      case 'motion':
        return 3;
    }
  }


}
