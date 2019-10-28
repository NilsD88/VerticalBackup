import { MOCK_THRESHOLD_TEMPLATES } from 'src/app/mocks/threshold-templates';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { SharedService } from 'src/app/services/shared.service';
import {Component, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {formatDate} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import jspdf from 'jspdf';
import { ILocation } from 'src/app/models/g-location.model';
import { NewLocationService } from 'src/app/services/new-location.service';
import { IAsset } from 'src/app/models/g-asset.model';
import { IThing } from 'src/app/models/g-thing.model';
import { NewAlertService } from 'src/app/services/new-alert.service';

declare var require: any;

const canvg = require('canvg');

interface IFilterChartData {
  interval: string;
  from: number;
  to: number;
  durationInHours?: number;
}

@Component({
  selector: 'pvf-detail2',
  templateUrl: './detail2.component.html',
  styleUrls: ['./detail2.component.scss']
})
export class Detail2Component implements OnInit {

  @ViewChild('myChart', {static: false}) myChart;
  @ViewChild('myAggregatedValues', {static: false}) myAggregatedValues;

  public asset: IAsset;
  public locations: ILocation[];

  public chartLoading = false;
  public chartData = [];
  public isDownloading = false;

  public currentFilter: IFilterChartData = {
    interval: 'HOURLY',
    from: moment().subtract(1, 'week').toDate().getTime(),
    to: moment().toDate().getTime(),
  };

  constructor(
    public activeRoute: ActivatedRoute,
    private translateService: TranslateService,
    private sharedService: SharedService,
    private newLocationService: NewLocationService,
    public newAlertService: NewAlertService,
    public newAssetService: NewAssetService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.init();
    this.newLocationService.getLocationsTree().subscribe((locations: ILocation[]) => {
      this.locations = locations;
    });
  }

  async init() {
    this.activeRoute.params.subscribe(async (params) => {
      if (params.id) {
        this.newAssetService.getAssetDetailById(params.id).subscribe(
          (asset) => {
          this.asset = asset;
          this.getChartData(null);
          },
          (error) => {
            console.log(error);
            this.router.navigate(['/error/404']);
          }
        );
      }
    });
  }

  public async getChartData(options: { interval?: string; from?: number; to?: number; }) {
    if (!this.asset) {
      return false;
    }
    this.changeDetectorRef.detectChanges();
    this.chartLoading = true;
    this.changeDetectorRef.detectChanges();
    if (!options) {
      options = this.currentFilter;
    }

    const interval = options.interval ?  options.interval : this.currentFilter.interval;
    const from = options.from ?  options.from : this.currentFilter.from;
    const to = options.to ?  options.to : this.currentFilter.to;
    const duration = moment.duration(moment(to).diff(from));
    const durationInHours =  +duration.asHours().toFixed(0);

    this.currentFilter = {
      interval,
      from,
      to,
      durationInHours
    };

    const assetId = this.asset.id ;

    this.newAssetService.getAssetDataById(assetId, interval, from, to).subscribe(async (things: IThing[]) => {
      const chartData = [];
      for (const thing of things) {
        for (const sensor of thing.sensors) {
          chartData.push({
            label: await this.translateService.get('SENSORTYPES.' + sensor.sensorType.name).toPromise(),
            series: [
              ...(sensor.data)
            ]
          });
        }
      }
      this.chartData = chartData;
      this.chartLoading = false;
      this.changeDetectorRef.detectChanges();
    });

    this.newAlertService.getAlertsByAssetIdAndDateRange(assetId, 0, new Date().getTime()).subscribe((alerts) => {
      this.asset.alerts = alerts;
    });
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

    pdf.addImage(this.asset.image, 'JPEG', 10 , 10, 30, 30);
    const assetNameTranslation: string = await this.getTranslation('PDF.ASSET_NAME');
    pdf.text(assetNameTranslation + ' : ' + this.asset.name, 45, 15);
    const clientNameTranslation: string = await this.getTranslation('PDF.CLIENT_NAME');
    pdf.text(clientNameTranslation + ' : ' + this.sharedService.user.orgName, 45, 20);

    const options = this.myChart.options;
    const locationNameTranslation: string = await this.getTranslation('PDF.LOCATION_NAME');
    const sublocationNameTranslation: string = await this.getTranslation('PDF.SUBLOCATION_NAME');
    pdf.text(locationNameTranslation + ' : ' + this.asset.location.name + '\n'
      + sublocationNameTranslation + ' : ' + this.asset.location.name, 45, 30);

    if ( options.series.length > 0) {
      setStyle('title');
      const chartTitle = await this.getTranslation('PDF.CHART');
      pdf.text(chartTitle, 10, 50);

      setStyle(null);
      const measurePeriodTranslation = await this.getTranslation('PDF.MEASURE_PERIOD');
      const toTranslation = await this.getTranslation('PDF.TO');

      const dateRange = this.myChart.range || {fromDate: new Date(this.currentFilter.from), toDate: new Date(this.currentFilter.to)};
      const timePeriod: string = measurePeriodTranslation + ' ' + formatDate(dateRange.fromDate, 'dd/MM/yyyy HH:mm', 'en-US')
        + ' ' + toTranslation + ' ' + formatDate(dateRange.toDate, 'dd/MM/yyyy HH:mm', 'en-US');
      pdf.text(timePeriod, 10, 55);

      if (this.currentFilter.durationInHours > 24) {
        const marginTop = 175;
        setStyle('title');
        const aggregatedTitle = await this.getTranslation('PDF.AGGREGATED_VALUES');
        pdf.text(aggregatedTitle, 10, marginTop - 15);

        // Header of table
        setStyle(null);
        const measurement = await this.getTranslation('DETAIL.AGGREGATED.MEASUREMENT');
        pdf.text(measurement, 10, marginTop - 10);
        const max = await this.getTranslation('DETAIL.AGGREGATED.MAX');
        pdf.text(max, 70, marginTop - 10);
        const min = await this.getTranslation('DETAIL.AGGREGATED.MIN');
        pdf.text(min, 105, marginTop - 10);
        const average = await this.getTranslation('DETAIL.AGGREGATED.AVERAGE');
        pdf.text(average, 140, marginTop - 10);
        const standardDeviation = await this.getTranslation('DETAIL.AGGREGATED.STANDARDDEVIATION');
        pdf.text(standardDeviation, 175, marginTop - 10);

        const aggregatedValues = this.myAggregatedValues.aggregatedValues;
        pdf.setTextColor(120, 120, 120);
        for ( let i = 0; i < aggregatedValues.length; i++) {
          const aggregatedValue = aggregatedValues[i];
          pdf.text((aggregatedValue.label) ? aggregatedValue.label.trunc(30) : '-', 10, marginTop + ( i * 10 ));
          pdf.text(aggregatedValue.max || '-', 70, marginTop + ( i * 10 ));
          pdf.text(aggregatedValue.min || '-', 105, marginTop + ( i * 10 ));
          pdf.text(aggregatedValue.average || '-', 140, marginTop + ( i * 10 ));
          pdf.text(aggregatedValue.standardDeviation || '-', 175, marginTop + ( i * 10));
          pdf.line(10, marginTop + (i * 10) + 5, 200, marginTop + (i * 10) + 5);
        }
      }

      let chart;
      for (const CHART of this.myChart.Highcharts.charts) {
        if ( typeof CHART !== 'undefined') {
          chart = CHART;
        }
      }

      const svgString = chart.getSVG({chart: {
        width: 1400,
        height: 600,
      }});

      const canvas = document.createElement('canvas');
      canvas.width = 1400;
      canvas.height = 600;

      canvg(canvas, svgString);

      const canvasB64 = canvas.toDataURL();
      pdf.addImage(canvasB64, 'PNG', 5 , 60, (1400 / 7), (600 / 7));
    }

    pdf.save(this.asset.name + '.pdf');
    this.isDownloading = false;
  }

  private async getTranslation(label: string) {
    return await (this.translateService.get(label).toPromise());
  }

}
