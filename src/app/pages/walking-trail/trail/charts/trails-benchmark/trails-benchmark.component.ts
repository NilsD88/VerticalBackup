import { WalkingTrailLocationService } from './../../../../../services/walkingtrail/location.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import {uniq} from 'lodash';

import * as randomColor from 'randomcolor';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import * as mTZ from 'moment-timezone';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { findLeafLocations } from '../../../utils';
import { 
  IPeopleCountingLocation,
  IPeopleCountingLocationSerie
} from 'src/app/models/peoplecounting/location.model';

declare global {
  interface Window {
    moment: any;
  }
}

declare var require: any;
require('highcharts/modules/boost');
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/no-data-to-display')(Highcharts);
require('highcharts/modules/streamgraph')(Highcharts);
require('highcharts/modules/series-label')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);


@Component({
  selector: 'pvf-trails-benchmark',
  templateUrl: './trails-benchmark.component.html',
  styleUrls: ['./trails-benchmark.component.scss']
})
export class TrailsBenchmarkComponent implements OnInit, OnChanges {

  @Input() parentLocation: IPeopleCountingLocation;

  public leafs: IPeopleCountingLocation[];
  public chart: any;
  public chartOptions: any;
  public locale: string;

  constructor(
    private translateService: TranslateService,
    private locationService: WalkingTrailLocationService,
    private datePipe: DatePipe,
    private router: Router
  ) {}


  ngOnInit() {
    this.locale = this.translateService.currentLang;
    moment.locale(this.locale + '-be');
    window.moment = moment;
    mTZ();

    this.locale = this.translateService.currentLang;
    this.translateService.onLangChange.subscribe(
      (langChangeEvent: LangChangeEvent) => {
        this.locale = langChangeEvent.lang;
      }
    );


    this.initChartOptions();
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('----');
    console.log(changes)
    console.log('----');

    if (changes.parentLocation) {
      if (changes.parentLocation.currentValue !== changes.parentLocation.previousValue) {
        this.updateChart();
      }
    }
  }

  private initChartOptions() {
    Highcharts.setOptions({
      lang: {
        weekdays: moment.weekdays(),
        shortWeekdays: moment.weekdaysShort()
      }
    });

    const instance = this;
    this.chartOptions = {
      chart: {
        type: 'streamgraph',
        marginBottom: 30,
        zoomType: 'x'
      },
      title: '',
      exporting: {
        csv: {
          dateFormat: '%d-%m-%Y %H:%M:%S',
        },
        enabled: true,
        filename: 'count-past-year',
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
                const trailId = this.series.userOptions.id;
                instance.router.navigateByUrl(`/private/walkingtrail/trail/${trailId}`);
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
      this.chart = Highcharts.chart('trails-benchmark-chart-container', this.chartOptions);
    } catch (error) {
      console.log(error);
    }
  }

  private async updateChart() {

    if (!this.parentLocation) {
      return;
    }

    const leafs: IPeopleCountingLocation[] = [];
    findLeafLocations(this.parentLocation, leafs);
    // Generate past week per hour per leaf
    /*
    leafs.forEach(leaf => {
      leaf.series = generatePastWeekPerHourOfDataSeries();
    });
    this.leafs = leafs;
    */


    // TODO: get past week per hour per locations from backend for each locations (or leaf locations?)
    this.leafs = await this.locationService.getLocationsDataByIds(
      leafs.map(leaf => leaf.id),
      'HOURLY',
      moment().subtract(1, 'week').startOf('isoWeek').valueOf(),
      moment().startOf('isoWeek').valueOf()
    ).toPromise();

    this.chartOptions.series = [];
    this.chartOptions.xAxis.categories = [];


    if ((leafs || []).length < 1) {
      return;
    }

    const colors = randomColor({count: this.leafs.length});
    const data = [];
    const xAxisCategories = [];
    this.chartOptions.colors = [];

    for (const leaf of this.leafs) {
      data.push({
        name: leaf.name,
        id: leaf.id,
        data: leaf.series.map(element => element.valueIn)
      });

      xAxisCategories.push(
        ...leaf.series.map(element => this.datePipe.transform(element.timestamp, 'EEEE HH:mm', null, this.locale))
      );
    }

    this.chartOptions.series = data;
    this.chartOptions.xAxis.categories = uniq(xAxisCategories);
    this.chartOptions.colors = colors;

    try {
      this.chart = Highcharts.chart('trails-benchmark-chart-container', this.chartOptions);
    } catch (error) {
      this.chartOptions.series = [];
      this.chartOptions.xAxis.categories = [];
      this.chartOptions.colors = [];
      this.chart = Highcharts.chart('trails-benchmark-chart-container', this.chartOptions);
      console.log(error);
    }
  }

}


function generatePastWeekPerHourOfDataSeries(): IPeopleCountingLocationSerie[] {
  const dataSeries: IPeopleCountingLocationSerie[] = [];
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    for (let hourIndex = 0; hourIndex < 24; hourIndex++) {
      dataSeries.push(
        {
          timestamp: moment().startOf('isoWeek').add(dayIndex, 'days').startOf('day').add(hourIndex, 'hours').valueOf(),
          valueIn: Math.floor(Math.random() * 101)
        }
      );
    }
  }
  return dataSeries;
}
