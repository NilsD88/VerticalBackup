import { StairwayToHealthLocationService } from 'src/app/services/stairway-to-health/location.service';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { SubSink } from 'subsink';
import {
  cloneDeep
} from 'lodash';
import {
  Component,
  OnInit,
  OnChanges,
  Input,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef,
  SimpleChanges
} from '@angular/core';
import * as moment from 'moment';
import {
  TranslateService
} from '@ngx-translate/core';
import * as mTZ from 'moment-timezone';
import {
  IFilterChartData,
  PeriodicDuration,
  Intervals
} from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';
import {
  compareTwoObjectOnSpecificProperties
} from 'src/app/shared/utils';
import {
  ILeafColors
} from 'src/app/shared/people-counting/dashboard/leaf.model';
import {
  Subject, Observable, of
} from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');
const exporting = require('highcharts/modules/exporting');
const exportData = require('highcharts/modules/export-data');
const Highcharts = require('highcharts/highstock');
const randomColor = require('randomcolor');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
exporting(Highcharts);
exportData(Highcharts);



@Component({
  selector: 'pvf-stairwaytohealth-dashboard-total-count-chart',
  templateUrl: './total-count-chart.component.html',
  styleUrls: ['./total-count-chart.component.scss']
})
export class TotalCountChartComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('dataRangeSelection', {
    static: false
  }) dataRangeSelection;

  @Input() locations: IPeopleCountingLocation[];
  @Input() locationColors: ILeafColors[];

  public filter: IFilterChartData = {
    interval: 'DAILY',
    from: moment().subtract(1, 'months').set({date: 1, hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
    to: moment().set({date: 1, hour: 0, minute: 0, second: 0, millisecond: 0}).valueOf(),
  };


  public chartData$ = new Subject < any > ();
  public chartLoading = false;
  public loadingError = false;
  public chart: any;
  public chartOptions: any;
  public locale: string;

  private subs = new SubSink();

  constructor(
    private translateService: TranslateService,
    private locationService: StairwayToHealthLocationService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.locale = this.translateService.currentLang;
    moment.locale(this.locale + '-be');
    window.moment = moment;
    mTZ();

    this.initChartOptions();
    this.initChart();
    this.subs.sink = this.getChartData(this.chartData$).subscribe(
      (locations: IPeopleCountingLocation[]) => {
        if (!this.loadingError) {
          this.updateChart(locations);
        }
      },
    );
  }


  public intervalChanged(event) {
    this.updateChartFilter({
      interval: event.value
    });
  }


  public dateRangeChanged(periodicDuration: PeriodicDuration) {
    this.updateChartFilter(periodicDuration);
  }

  public updateChartFilter(options: {interval?: string; from?: number; to?: number; }) {
    const interval = options.interval ? options.interval as Intervals : this.filter.interval as Intervals;
    const from = options.from ? options.from : this.filter.from;
    const to = options.to ? options.to : this.filter.to;
    const duration = moment.duration(moment(to).diff(from));
    const durationInHours = +duration.asHours().toFixed(0);
    const originalFilter = cloneDeep(this.filter);

    this.filter = {
      interval,
      from,
      to,
      durationInHours
    };

    const differences = compareTwoObjectOnSpecificProperties(
      originalFilter, this.filter, ['interval', 'from', 'to', 'durationInHours']);

    if ((differences && differences.length > 0)) {
      this.chartData$.next(this.filter);
    }
  }

  private updateChart(locations: IPeopleCountingLocation[]) {
    const series = [];
    locations.forEach((location) => {
      const locationId = location.id;
      series.push(
        {
          id: locationId,
          name: location.name,
          color: (this.locationColors.find(element => element.id === locationId) || {})['color'] || randomColor(),
          data: location.series.map((serie) => {
            return [serie.timestamp, serie.valueIn ? parseFloat(serie.valueIn.toFixed(2)) : null];
          })
        }
      );
    });

    this.chartOptions.series = series;
    this.chartLoading = false;

    try {
      this.chart = Highcharts.chart('stairway-count-chart', this.chartOptions);
    } catch (error) {
      this.chartOptions.series = [];
      this.chart = Highcharts.chart('stairway-count-chart', this.chartOptions);
      console.log(error);
    }
  }

  private getChartData(request: Observable<IFilterChartData>): Observable<IPeopleCountingLocation[]> {
    return request.pipe(
      debounceTime(500),
      switchMap(filter => {
        this.chartLoading = true;
        this.loadingError = false;
        this.changeDetectorRef.detectChanges();
        // REAL DATA
        return this.locationService.getLocationsDataByIds(
          this.locations.map(location => location.id),
          filter.interval, filter.from, filter.to
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
    this.chartData$.next(this.filter);
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.locations) {
      if (changes.locations.currentValue && changes.locations.currentValue !== changes.locations.previousValue) {
        this.chartData$.next(this.filter);
      }
    }
  }

  private initChartOptions() {
    const instance = this;
    this.chartOptions = {
      time: {
        timezone: 'Europe/Brussels'
      },
      chart: {
        type: 'column',
        marginBottom: 100,
        zoomType: 'x',
      },
      title: '',
      exporting: {
        csv: {
          dateFormat: '%d-%m-%Y %H:%M:%S',
        },
        enabled: true,
        filename: 'stairway-to-health',
      },
      credits: {
        enabled: false
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        allowDecimals: false,
        title: {
          text: '',
        }
      },
      plotOptions: {
        series: {
          point: {
            events: {
              click: function (event) {
                const locationId = this.series.userOptions.id;
                instance.router.navigateByUrl(`/private/stairwaytohealth/place/${locationId}`);
              }
            }
          }
        }
      },
      series: [],
    };
  }

  private initChart() {
    try {
      this.chart = Highcharts.chart('stairway-count-chart', this.chartOptions);
    } catch (error) {
      console.log(error);
    }
  }


  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
