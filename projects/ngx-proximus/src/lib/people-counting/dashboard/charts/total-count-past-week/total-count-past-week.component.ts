import { cloneDeep } from 'lodash';
import { Component, Input, OnChanges, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IWalkingTrailLocation } from 'src/app/models/walkingtrail/location.model';
import { decreaseLeafs } from '../../dashboard.component';

import * as randomColor from 'randomcolor';
import * as Highcharts from 'highcharts';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/treemap')(Highcharts);


@Component({
  selector: 'pxs-peoplecounting-dashboard-total-count-past-week',
  templateUrl: './total-count-past-week.component.html',
  styleUrls: ['./total-count-past-week.component.scss']
})
export class TotalCountPastWeekComponent implements OnInit, OnChanges {

  @Input() leafs: IWalkingTrailLocation[];

  public chart: any;
  public chartOptions: any;

  constructor() { }

  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }
  }

  ngOnInit() {
    this.initChartOptions();
    this.initChart();
    this.updateChart();
  }

  private initChartOptions() {
    this.chartOptions = {
      chart: {
        height: 400,
      },
      title: 'Trail status',
      exporting: {
        csv: {
          dateFormat: '%d-%m-%Y %H:%M:%S',
        },
        enabled: true,
        filename: 'count-past-week',
      },
      credits: {
        enabled: false
      },
      tooltip: {
        crosshairs: true,
        shared: true,
      },
      series: [{
        type: 'treemap',
        layoutAlgorithm: 'stripes',
        alternateStartingDirection: true,
        levels: [{
            level: 1,
            layoutAlgorithm: 'sliceAndDice',
            dataLabels: {
                enabled: true,
                align: 'left',
                verticalAlign: 'top',
                style: {
                    fontSize: '15px',
                    fontWeight: 'bold'
                }
            }
        }],
        data: [],
      }]
    };
  }

  private initChart() {
    try {
      this.chart = Highcharts.chart('total-count-past-week-chart-container', this.chartOptions);
    } catch (error) {
      console.log(error);
    }
  }

  private updateChart() {
    this.chartOptions.series[0].data = [];
    if ((this.leafs || []).length < 1) {
      return;
    }

    const data = [];
    const leafs = decreaseLeafs(cloneDeep(this.leafs));
    const colors = randomColor({count: leafs.length});
    let counter = 0;
    for (const leaf of leafs) {
      data.push({
        id: leaf.id,
        name: leaf.name,
        color: colors[counter++]
      });
      if ((leaf.children || []).length > 0) {
        for (const child of leaf.children) {
          data.push({
            name: child.name,
            parent: leaf.id,
            value: child.series.reduce((a, b) => a + b.sum || 0, 0)
          });
        }
      }
    }
    this.chartOptions.series[0].data = data;
    try {
      this.chart = Highcharts.chart('total-count-past-week-chart-container', this.chartOptions);
    } catch (error) {
      this.chartOptions.series[0].data = [];
      this.chart = Highcharts.chart('total-count-past-week-chart-container', this.chartOptions);
      console.log(error);
    }
  }
}
