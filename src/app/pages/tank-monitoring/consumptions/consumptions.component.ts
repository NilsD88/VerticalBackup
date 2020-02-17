import { SubSink } from 'subsink';
import { Intervals } from './../../../../../projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';
import { SharedService } from 'src/app/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { TankMonitoringAssetService } from 'src/app/services/tankmonitoring/asset.service';
import { cloneDeep } from 'lodash';
import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { IFilterChartData } from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';
import { ActivatedRoute, Router } from '@angular/router';
import { IAsset } from 'src/app/models/asset.model';
import { Observable, Subject, of} from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { compareTwoObjectOnSpecificProperties } from 'src/app/shared/utils';
import { AlertService } from 'src/app/services/alert.service';
import {formatDate} from '@angular/common';
import * as moment from 'moment';
import * as jspdf from 'jspdf';
import {MatDialog} from '@angular/material';
import {DialogComponent} from 'projects/ngx-proximus/src/lib/dialog/dialog.component';

declare var require: any;
const canvg = require('canvg');

@Component({
  selector: 'pvf-consumptions',
  templateUrl: './consumptions.component.html',
  styleUrls: ['./consumptions.component.scss']
})
export class ConsumptionsComponent implements OnInit, OnDestroy {

  @ViewChild('myChart', {static: false}) myChart;

  public asset: IAsset;

  public chartLoading = false;
  public chartData$ = new Subject<any>();
  public chartData = [];

  public currentFilter: IFilterChartData = {
    interval: 'HOURLY',
    from: moment().subtract(1, 'week').startOf('day').toDate().getTime(),
    to: moment().toDate().getTime(),
  };

  private subs = new SubSink();

  constructor(
    private activeRoute: ActivatedRoute,
    private tankMonitoringAssetService: TankMonitoringAssetService,
    private alertService: AlertService,
    private sharedService: SharedService,
    private translateService: TranslateService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(async (params) => {
      if (params.id) {
        this.subs.add(
          this.tankMonitoringAssetService.getAssetDetailById(params.id).subscribe(
            (asset) => {
              this.asset = asset;
              this.changeDetectorRef.detectChanges();
              this.init();
            },
            (error) => {
              console.error(error);
              this.router.navigate(['/error/404']);
            }
          )
        );
      }
    });
  }

  private init() {
    this.getLastAlerts();
    this.subs.add(
      this.getChartData(this.chartData$).subscribe(things => {
        const chartData = [];
        // Get the translation of each label
        for (const thing of things) {
          for (const sensor of thing.sensors) {
            chartData.push({
              label: sensor.sensorType.name,
              series: sensor.series
            });
          }
        }
        this.chartData = chartData;
        this.chartLoading = false;
        this.changeDetectorRef.detectChanges();
      })
    );
    this.chartData$.next(this.currentFilter);
  }

  private async getSensorTypeTranslation(name: string): Promise<string> {
    const translated = await this.translateService.get('SENSORTYPES.' + name).toPromise();
    if (translated.indexOf('SENSORTYPES') !== -1) {
      return this.upperCaseFirst(name);
    } else {
      return translated;
    }

  }

  private upperCaseFirst(transform: string) {
    return transform.charAt(0).toUpperCase() + transform.slice(1);
  }

  private getLastAlerts() {
    this.subs.add(
      this.alertService.getLastAlertsByAssetId(this.asset.id).subscribe((alerts) => {
        this.asset.alerts = alerts;
      })
    );
  }


  public updateChartData(options: { interval?: string; from?: number; to?: number; }) {
    const interval = options.interval ? options.interval : this.currentFilter.interval;
    const from = options.from ? options.from : this.currentFilter.from;
    const to = options.to ? options.to : this.currentFilter.to;
    const duration = moment.duration(moment(to).diff(from));
    const durationInHours = +duration.asHours().toFixed(0);
    const originalFilter = cloneDeep(this.currentFilter);

    this.currentFilter = {
      interval: interval as Intervals,
      from,
      to,
      durationInHours
    };

    const differences = compareTwoObjectOnSpecificProperties(
      originalFilter, this.currentFilter, ['interval', 'from', 'to', 'durationInHours']);

    if (differences && differences.length > 0) {
      this.chartData$.next(this.currentFilter);
    }
  }

  public async downloadPdfDetail() {
    const pdf = new jspdf('p', 'mm', 'a4', 1); // A4 size page of PDF (210 x 297)
    pdf.setFontSize(10);

    function setStyle(styleName) {
      switch (styleName) {
        case 'title':
          pdf.setFontStyle('bold');
          pdf.setTextColor(92, 45, 145);
          break;
        default:
          pdf.setFontStyle('normal');
          pdf.setTextColor(0, 0, 0);
          break;
      }
    }

    if (this.asset.image) {
      pdf.addImage(this.asset.image, 'JPEG', 10, 10, 30, 30);
    }

    const clientNameTranslation: string = await this.getTranslation('PDF.CLIENT_NAME');
    pdf.text(clientNameTranslation + ' : ' + this.sharedService.user.orgName, 45, 15);
    const assetNameTranslation: string = await this.getTranslation('PDF.ASSET_NAME');
    pdf.text(assetNameTranslation + ' : ' + this.asset.name, 45, 20);
    const locationNameTranslation: string = await this.getTranslation('PDF.LOCATION_NAME');
    pdf.text(locationNameTranslation + ' : ' + this.asset.location.name, 45, 25);

    const options = this.myChart.options;
    if (options.series.length > 0) {
      setStyle('title');
      const chartTitle = await this.getTranslation('PDF.CHART');
      pdf.text(chartTitle, 10, 50);

      setStyle(null);
      const measurePeriodTranslation = await this.getTranslation('PDF.MEASURE_PERIOD');
      const toTranslation = await this.getTranslation('PDF.TO');

      const dateRange = this.myChart.range || {fromDate: new Date(this.currentFilter.from), toDate: new Date(this.currentFilter.to)};
      const timePeriod: string = measurePeriodTranslation + ' ' + formatDate(dateRange.fromDate, 'dd/MM/yyyy HH:mm', 'en-US')
        + ' ' + toTranslation + ' ' + formatDate(dateRange.toDate, 'dd/MM/yyyy HH:mm', 'en-US');
      pdf.text(timePeriod, 10, 55);


      let chart;
      for (const CHART of this.myChart.Highcharts.charts) {
        if (typeof CHART !== 'undefined') {
          chart = CHART;
        }
      }

      const svgString = chart.getSVG({
        chart: {
          width: 1400,
          height: 600,
        }
      });

      const canvas = document.createElement('canvas');
      canvas.width = 1400;
      canvas.height = 600;

      canvg(canvas, svgString);

      const canvasB64 = canvas.toDataURL();
      pdf.addImage(canvasB64, 'PNG', 5, 60, (1400 / 7), (600 / 7));
    }

    pdf.save(this.asset.name + '.pdf');
  }

  private getChartData(request: Observable<any>) {
    return request.pipe(
      debounceTime(500),
      switchMap(filter => {
        this.chartLoading = true;
        this.changeDetectorRef.detectChanges();
        return this.tankMonitoringAssetService.getAssetDataById(this.asset.id, filter.interval, filter.from, filter.to).pipe(
          catchError(() => {
            this.dialog.open(DialogComponent, {
              data: {
                title: 'Sorry, an error has occured!',
                message: 'An error has occured during getting the sensor data'
              },
              minWidth: '320px',
              maxWidth: '400px',
              width: '100vw',
              maxHeight: '80vh',
            });
            return of([]);
          })
        );
      })
    );
  }

  private async getTranslation(label: string) {
    return await (this.translateService.get(label).toPromise());
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
