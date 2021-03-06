import { Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { uniq } from 'lodash';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';


declare global {
  interface Window {
    moment: any;
  }
}


import * as Highcharts from 'highcharts';
import { ILeafColors } from '../../leaf.model';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { HIGHCHARTS_MENU_ITEMS } from 'src/app/shared/global';

declare var require: any;
require('highcharts/modules/boost');
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/no-data-to-display')(Highcharts);
require('highcharts/modules/streamgraph')(Highcharts);
require('highcharts/modules/series-label')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

@Component({
  selector: 'pvf-peoplecounting-total-count-past-year',
  templateUrl: './total-count-past-year.component.html',
  styleUrls: ['./total-count-past-year.component.scss']
})
export class TotalCountPastYearComponent implements OnInit, OnChanges {

  @Input() leafs: IPeopleCountingLocation[];
  @Input() leafColors: ILeafColors[];
  @Input() leafUrl = '/private/walking-trails/trail';
  @Input() loading = false;
  @Input() loadingError = false;

  @Output() wantTryAgain: EventEmitter <null> = new EventEmitter();

  public chart: any;
  public chartOptions: any;
  public locale: string;

  constructor(
    private datePipe: DatePipe,
    private translateService: TranslateService,
    private router: Router,
  ) { }

  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }
  }

  ngOnInit() {
    this.locale = this.translateService.currentLang;
    this.translateService.onLangChange.subscribe(
      (langChangeEvent: LangChangeEvent) => {
        this.locale = langChangeEvent.lang;
      }
    );

    this.initChartOptions();
    this.initChart();
    this.updateChart();
  }

  private initChartOptions() {
    const instance = this;
    this.chartOptions = {
      chart: {
        type: 'streamgraph',
        marginBottom: 30,
        zoomType: 'x'
      },
      title: 'Last year',
      exporting: {
        csv: {
          dateFormat: '%d-%m-%Y %H:%M:%S',
        },
        enabled: true,
        filename: 'count-past-year',
        buttons: {
          contextButton: {
            menuItems: HIGHCHARTS_MENU_ITEMS
          }
        }
      },
      colors: [],
      credits: {
        enabled: false
      },
      tooltip: {
        crosshairs: true,
        shared: true,
      },
      xAxis: {
        maxPadding: 0,
        type: 'category',
        crosshair: true,
        categories: [],
        labels: {
            align: 'left',
            reserveSpace: false,
            rotation: 270
        },
        lineWidth: 0,
        margin: 20,
        tickWidth: 0
      },
      yAxis: {
          visible: false,
          startOnTick: false,
          endOnTick: false
      },
      plotOptions: {
        series: {
          point: {
            events: {
              click: function (event) {
                const locationId = this.series.userOptions.id;
                instance.router.navigateByUrl(`${instance.leafUrl}/${locationId}`);
              }
            }
          },
          label: {
              minFontSize: 5,
              maxFontSize: 15,
              style: {
                  color: 'rgba(255,255,255,0.75)'
              }
          },
        }
      },
      legend: {
        enabled: false
      },
      series: [],
    };
  }

  private initChart() {
    try {
      this.chart = Highcharts.chart('total-count-past-year-chart-container', this.chartOptions);
    } catch (error) {
      console.error(error);
    }
  }

  private updateChart() {
    this.chartOptions.series = [];
    this.chartOptions.xAxis.categories = [];
    this.chartOptions.colors = [];

    if ((this.leafs || []).length < 1) {
      return;
    }

    const data = [];
    const xAxisCategories = [];
    for (const leaf of this.leafs) {
      data.push({
        name: leaf.name,
        id: leaf.id,
        data: leaf.series.map(element => element.valueIn)
      });
      xAxisCategories.push(
        ...leaf.series.map(element => this.datePipe.transform(element.timestamp, 'MMMM', null, this.locale))
      );
    }

    this.chartOptions.series = data;
    this.chartOptions.xAxis.categories = uniq(xAxisCategories);
    this.chartOptions.colors = this.leafColors.map(element => element.color);

    try {
      this.chart = Highcharts.chart('total-count-past-year-chart-container', this.chartOptions);
    } catch (error) {
      this.chartOptions.series = [];
      this.chartOptions.xAxis.categories = [];
      this.chart = Highcharts.chart('total-count-past-year-chart-container', this.chartOptions);
      console.error(error);
    }
  }


}
