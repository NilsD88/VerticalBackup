import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { Component, Input, OnChanges, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import * as randomColor from 'randomcolor';

import * as Highcharts from 'highcharts';
import { decreaseLeafs } from 'src/app/shared/utils';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { isNullOrUndefined } from 'util';
import { ILeafColors } from '../../leaf.model';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/treemap')(Highcharts);


@Component({
  selector: 'pvf-peoplecounting-total-count-past-week',
  templateUrl: './total-count-past-week.component.html',
  styleUrls: ['./total-count-past-week.component.scss']
})
export class TotalCountPastWeekComponent implements OnInit, OnChanges {

  @Input() leafs: IPeopleCountingLocation[];
  @Input() leafColors: ILeafColors[];
  @Input() leafUrl: string;
  @Input() loading = false;
  @Input() loadingError = false;

  @Output() wantTryAgain: EventEmitter <null> = new EventEmitter();

  public chart: any;
  public chartOptions: any;

  constructor(private router: Router) { }

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
    const instance = this;
    this.chartOptions = {
      title: {
        text: ''
      },
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
      }],
      plotOptions: {
        series: {
          marker: {
            enabled: false
          },
          events: {
            click: function (event) {
              const leafId = event.point.options.id;
              if (!isNullOrUndefined(leafId)) {
                instance.router.navigateByUrl(`${instance.leafUrl}/${leafId}`);
              }
            }
          }
        }
      },
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
    for (const leaf of leafs) {
      data.push({
        id: leaf.id,
        name: leaf.name,
      });
      if ((leaf.children || []).length > 0) {
        for (const child of leaf.children) {
          data.push({
            name: child.name,
            parent: leaf.id,
            id: child.id,
            color: (this.leafColors.find(element => element.id === child.id) || {})['color'] || randomColor(),
            value: child.series.reduce((a, b) => a + b.valueIn || 0, 0)
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
