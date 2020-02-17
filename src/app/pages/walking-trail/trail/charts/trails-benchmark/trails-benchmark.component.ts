import { SubSink } from 'subsink';
import { WalkingTrailLocationService } from './../../../../../services/walkingtrail/location.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
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
} from 'src/app/models/peoplecounting/location.model';
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';

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
export class TrailsBenchmarkComponent implements OnInit, OnChanges, OnDestroy {

  @Input() parentLocation: IPeopleCountingLocation;

  public leafs: IPeopleCountingLocation[] = [];
  public chart: any;
  public chartOptions: any;
  public locale: string;

  public chartData$ = new Subject<any>();
  public chartLoading = false;
  public loadingError = false;

  private subs = new SubSink();

  constructor(
    private translateService: TranslateService,
    private locationService: WalkingTrailLocationService,
    private datePipe: DatePipe,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
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
    this.subs.sink = this.getChartData(this.chartData$).subscribe(
      (locations: IPeopleCountingLocation[]) => {
        if (!this.loadingError) {
          this.updateChart(locations);
        } else {
        }
      }
    );
    if ((this.leafs || []).length) {
      this.chartData$.next();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.parentLocation) {
      if (changes.parentLocation.currentValue !== changes.parentLocation.previousValue) {
        const leafs: IPeopleCountingLocation[] = [];
        findLeafLocations(this.parentLocation, leafs);
        this.leafs = leafs;
        if ((this.leafs || []).length) {
          this.chartData$.next();
        }
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
      console.error(error);
    }
  }

  private async updateChart(locations: IPeopleCountingLocation[]) {

    if (!this.parentLocation) {
      this.chartLoading = false;
      return;
    }

    this.chartOptions.series = [];
    this.chartOptions.xAxis.categories = [];

    const colors = randomColor({count: locations.length});
    const data = [];
    const xAxisCategories = [];
    this.chartOptions.colors = [];

    for (const location of locations) {
      data.push({
        name: location.name,
        id: location.id,
        data: location.series.map(element => element.valueIn)
      });

      xAxisCategories.push(
        ...location.series.map(element => this.datePipe.transform(element.timestamp, 'EEEE HH:mm', null, this.locale))
      );
    }

    this.chartOptions.series = data;
    this.chartOptions.xAxis.categories = uniq(xAxisCategories);
    this.chartOptions.colors = colors;
    this.chartLoading = false;

    try {
      this.chart = Highcharts.chart('trails-benchmark-chart-container', this.chartOptions);
    } catch (error) {
      this.chartOptions.series = [];
      this.chartOptions.xAxis.categories = [];
      this.chartOptions.colors = [];
      this.chart = Highcharts.chart('trails-benchmark-chart-container', this.chartOptions);
      console.error(error);
    }
  }

  private getChartData(request: Observable<null>): Observable<IPeopleCountingLocation[]> {
    return request.pipe(
      debounceTime(500),
      switchMap(() => {
        this.chartLoading = true;
        this.loadingError = false;
        this.changeDetectorRef.detectChanges();
        // REAL DATA
        return this.locationService.getLocationsDataByIds(
          this.leafs.map(leaf => leaf.id),
          'HOURLY',
          moment().subtract(1, 'week').startOf('isoWeek').valueOf(),
          moment().startOf('isoWeek').valueOf()
        ).pipe(catchError((error) => {
          console.error(error);
          this.chartLoading = false;
          this.loadingError = true;
          return of([]);
        }));
      })
    );
  }

  public tryAgain() {
    this.chartData$.next();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
