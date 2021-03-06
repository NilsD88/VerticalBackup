import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { WalkingTrailsAssetService } from 'src/app/services/walking-trails/asset.service';
import {
  Component,
  OnInit,
  OnChanges,
  Input,
  ChangeDetectorRef,
  SimpleChanges,
  OnDestroy
} from '@angular/core';


import * as Highcharts from 'highcharts';
import { IPeopleCountingAsset } from 'src/app/models/peoplecounting/asset.model';
import * as moment from 'moment';
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { HIGHCHARTS_MENU_ITEMS } from 'src/app/shared/global';
import { generatePxsGradientColor } from 'src/app/shared/utils';

declare global {
  interface Window {
    moment: any;
  }
}

declare var require: any;
require('highcharts/modules/boost');
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/no-data-to-display')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

@Component({
  selector: 'pvf-peoplecounting-count-by-asset',
  templateUrl: './count-by-asset.component.html',
  styleUrls: ['./count-by-asset.component.scss']
})
export class CountByAssetComponent implements OnInit, OnChanges, OnDestroy {

  @Input() leaf: IPeopleCountingLocation;
  @Input() assets: IPeopleCountingAsset[];
  @Input() assetUrl: string;
  @Input() assetService: WalkingTrailsAssetService;
  @Input() assetColors: string[];

  public chartData$ = new Subject<any>();
  public chart: any;
  public chartOptions: any;
  public chartLoading = false;
  public loadingError = false;

  private subs = new SubSink();

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.assets) {
      if (changes.assets.currentValue && changes.assets.currentValue !== changes.assets.previousValue) {
        if ((this.assets || []).length) {
          this.chartData$.next();
        }
      }
    }
  }

  async ngOnInit() {
    if (!this.assets) {
      this.assets = await this.assetService.getAssetsByLocationId(this.leaf.id).toPromise();
    }
    this.initChartOptions();
    this.initChart();
    this.subs.sink = this.getChartData(this.chartData$).subscribe(
      (assets: IPeopleCountingAsset[]) => {
        if (!this.loadingError) {
          this.updateChart(assets);
        }
      },
    );
    if ((this.assets || []).length) {
      this.chartData$.next();
    }
  }

  private initChartOptions() {
    this.chartOptions = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
      },
      title: {
        text: this.translateService.instant('PEOPLE_COUNTING.COUNT_BY_ASSET')
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: true,
        filename: 'count-by-asset',
        buttons: {
          contextButton: {
            menuItems: HIGHCHARTS_MENU_ITEMS
          }
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          },
          innerSize: 100,
          depth: 0
        },
        series: {
          point: {
            events: {
              click: (event) => {
                this.router.navigateByUrl(`${this.assetUrl}${event.point.id}`);
              }
            }
          }
        }
      },
      series: [{
        name: 'Checkpoint',
        colorByPoint: true,
        data: []
      }]
    };
  }

  private initChart() {
    try {
      this.chart = Highcharts.chart('count-by-asset-chart-container', this.chartOptions);
    } catch (error) {
      console.error(error);
    }
  }

  private async updateChart(assets: IPeopleCountingAsset[]) {
    if ((assets || []).length) {
      const data = [];
      const assetColors = this.assetColors || generatePxsGradientColor(this.assets.length);
      assets.forEach((asset, assetIndex) => {
        const series = asset.series || [];
        data.push({
          id: asset.id,
          name: asset.name,
          color: assetColors[assetIndex],
          y: (series.length) ? asset.series[0].valueIn : null,
        });
      });
      this.chartOptions.series[0].data = data;
    }
    this.chartLoading = false;

    try {
      this.chart = Highcharts.chart('count-by-asset-chart-container', this.chartOptions);
    } catch (error) {
      this.chartOptions.series[0].data = [];
      this.chart = Highcharts.chart('count-by-asset-chart-container', this.chartOptions);
      console.error(error);
    }
  }

  private getChartData(request: Observable<null>): Observable<IPeopleCountingAsset[]> {
    return request.pipe(
      debounceTime(500),
      switchMap(() => {
        this.chartLoading = true;
        this.loadingError = false;
        this.changeDetectorRef.detectChanges();
        // REAL DATA
        if (this.assets.length) {
          return this.assetService.getAssetsDataByIds(
            this.assets.map(asset => asset.id),
            'DAILY',
            moment().startOf('day').valueOf(),
            moment().endOf('day').valueOf(),
          ).pipe(catchError((error) => {
            console.error(error);
            this.chartLoading = false;
            this.loadingError = true;
            return of([]);
          }));
        } else {
          this.chartLoading = false;
          return of([]);
        }
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


