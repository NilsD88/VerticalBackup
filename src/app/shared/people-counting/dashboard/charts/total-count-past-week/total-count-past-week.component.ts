import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { Component, Input, OnChanges, OnInit, ViewChild, ElementRef, Output, EventEmitter, SimpleChanges } from '@angular/core';
import * as randomColor from 'randomcolor';

import * as Highcharts from 'highcharts';
import { increaseLeafs } from 'src/app/shared/utils';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { ILeafColors } from '../../leaf.model';
import { HIGHCHARTS_MENU_ITEMS } from 'src/app/shared/global';
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.leafs) {
      if (changes.leafs.currentValue && changes.leafs.currentValue !== changes.leafs.previousValue) {
        if (this.chart) {
          this.updateChart();
        }
      }
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
        buttons: {
          contextButton: {
            menuItems: HIGHCHARTS_MENU_ITEMS
          }
        }
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
              try {
                const {id, parent} = event.point.options;
                if (parent) {
                  instance.router.navigateByUrl(`${instance.leafUrl}/${id}`);
                }
              } catch (error) {
                console.error(error);
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
      console.error(error);
    }
  }

  private updateChart() {
    this.chartOptions.series[0].data = [];
    if ((this.leafs || []).length < 1) {
      return;
    }

    const data = [];
    const leafs = increaseLeafs(cloneDeep(this.leafs));
    for (const leaf of leafs) {
      data.push({
        id: leaf.id || 'null',
        name: leaf.id ? leaf.name : '',
      });
      if ((leaf.children || []).length > 0) {
        for (const child of leaf.children) {
          data.push({
            name: child.name,
            parent: leaf.id || 'null',
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
      console.error(error);
    }
  }
}
