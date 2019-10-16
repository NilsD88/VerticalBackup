import { MOCK_THINGS } from './../../../mocks/things';
import { MOCK_THRESHOLD_TEMPLATES } from 'src/app/mocks/threshold-templates';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { SharedService } from 'src/app/services/shared.service';
import {Component, OnInit, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {formatDate} from '@angular/common';
import {Asset} from 'src/app/models/asset.model';
import {AssetService} from 'src/app/services/asset.service';
import {isNullOrUndefined} from 'util';
import {Alert} from 'src/app/models/alert.model';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import { ISensorReadingFilter } from 'src/app/models/sensor.model';
import { LogsService } from 'src/app/services/logs.service';
import jspdf from 'jspdf';
import { ILocation } from 'src/app/models/g-location.model';
import { NewLocationService } from 'src/app/services/new-location.service';
import { IAsset } from 'src/app/models/g-asset.model';
import { AlertsService } from 'src/app/services/alerts.service';
import { MOCK_CHART_DATA } from 'src/app/mocks/chart';

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

  @ViewChild('myChart') myChart;
  @ViewChild('myAggregatedValues') myAggregatedValues;

  public asset: IAsset;
  public locations: ILocation[];
  public lastAlert: Alert;
  public numberOfAlertsOfTheDay: number;
  public chartSensorOptions = [];
  public chartLoading = false;
  public chartData = [];
  public standardDeviations = [];
  public isDownloading = false;
  public currentFilter: IFilterChartData = {
    interval: 'HOURLY',
    from: moment().subtract(1, 'week').toDate().getTime(),
    to: moment().toDate().getTime(),
  };
  public mapLayers = [];
  public mapConfig;


  public btnOptsExportAlerts: MatProgressButtonOptions = {
    active: false,
    text: 'Download alerts of the day',
    buttonColor: 'primary',
    spinnerSize: 19,
    raised: false,
    stroked: true,
    flat: false,
    fab: false,
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
  };

  public filter = {
    dateRange: {fromDate: new Date(), toDate: new Date()},
    sensorTypes: [],
    thresholdTemplates: [],
    name: '',
  };

  public MOCK_THRESHOLD_TEMPLATE = MOCK_THRESHOLD_TEMPLATES[0];

  constructor(
    public activeRoute: ActivatedRoute,
    private assetService: AssetService,
    private router: Router,
    private translateService: TranslateService,
    private logsService: LogsService,
    private sharedService: SharedService,
    private newLocationService: NewLocationService,
    public alertsService: AlertsService,
    public newAssetService: NewAssetService
  ) {}

  ngOnInit() {
    this.init();
    this.newLocationService.getLocationsTree().subscribe((locations: ILocation[]) => {
      this.locations = locations;
    });
  }

  async init() {
    try {
      const id = await this.getRouteId();
      this.asset = await this.newAssetService.getAssetById(id).toPromise();
      this.asset.location = await this.newLocationService.getLocationById(this.asset.locationId).toPromise();
      // TODO: remove these lines
      this.asset.things = MOCK_THINGS;
      console.log({...this.asset});

      this.lastAlert = await this.alertsService.getLastAlertByAssetId(309);
      const alertsOfTheDay = this.alertsService.getPagedAlerts({
        ...this.filter,
        assetId: 309
      }, 0, 1);
      this.numberOfAlertsOfTheDay = (await alertsOfTheDay).totalElements;

      //TODO: get the things of the asset and get all their sensors
      /*
      this.chartSensorOptions = this.asset.sensors ? this.asset.sensors.map((val) => {
        return {
          deveui: val.devEui,
          sensorTypeId: val.sensorType.id
        };
      }) : [];
      */
      this.getChartData(null);


      /*
      console.log('-----id');
      const assetPromise = this.assetService.getAssetById(id);
      const lastAlertPromise = this.alertsService.getLastAlertByAssetId(id);
      this.asset = await assetPromise;
      console.log('-----asset');
      this.lastAlert = await lastAlertPromise;
      console.log('-----alert');
      this.asset.lastAlert = this.lastAlert;
      const alertsOfTheDay = this.alertsService.getPagedAlerts({
        ...this.filter,
        assetId: this.asset.id
      }, 0, 1);
      this.numberOfAlertsOfTheDay = (await alertsOfTheDay).totalElements;
      this.chartSensorOptions = this.asset.sensors ? this.asset.sensors.map((val) => {
        return {
          deveui: val.devEui,
          sensorTypeId: val.sensorType.id
        };
      }) : [];
      this.getChartData(null);
      */

    } catch (err) {
      console.log(err);
      //this.router.navigate(['/error/404']);
    }
  }

  private getRouteId(): Promise<string> {
    // TODO: remove these lines
    return new Promise((resolve, reject) => {
      resolve('1');
    });

    return new Promise((resolve, reject) => {
      this.activeRoute.params.subscribe((params) => {
        if (!isNullOrUndefined(params.id)) {
          resolve(params.id);
        } else {
          reject('DetailComponent: No \'id\' parameter in route.');
        }
      }, reject);
    });
  }


  public async getChartData(options: { interval?: string; from?: number; to?: number; }) {

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

    // TODO: remove these lines
    this.chartData = MOCK_CHART_DATA;
    return;


    this.chartLoading = true;
    const logsPromises = [];
    const standardDeviationPromises = [];

    if (durationInHours <= 24) {
      for (const sensorType of this.chartSensorOptions) {
        const filter: ISensorReadingFilter = {
          deveui: sensorType.deveui,
          sensortypeid: sensorType.sensorTypeId,
          from,
          to,
          interval,
        };
        logsPromises.push(this.logsService.getSensorReadingsV2(filter));
      }
    } else {
      for (const sensorType of this.chartSensorOptions) {
        const filter: ISensorReadingFilter = {
          deveui: sensorType.deveui,
          sensortypeid: sensorType.sensorTypeId,
          from,
          to,
          interval,
        };
        logsPromises.push(this.logsService.getSensorReadings(filter));
        standardDeviationPromises.push(this.logsService.getStandardDeviation(filter));
      }
    }

    this.standardDeviations = await Promise.all(standardDeviationPromises);
    this.chartData = await Promise.all(logsPromises);
    console.log(this.chartData);
    this.chartLoading = false;
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

  public async exportAlerts() {
    this.btnOptsExportAlerts.active = true;
    const result = await this.alertsService.getPagedAlerts(
      {
        ...this.filter,
        assetId: this.asset.id,
        //dateRange: {fromDate: new Date(this.currentFilter.from), toDate: new Date(this.currentFilter.to)},
      },
      0,
      10,
      // TODO: Too long request, need to remove picture/asset from the request
    );

    let csv = 'Asset, Location type, Date, Message, Threshold template, read\n';
    for (const alert of result.alerts) {
      csv += alert.asset.name + ', ';
      csv += alert.sublocation.location.locationType.name + ', ';
      csv += moment(alert.sensorReading.timestamp).format('DD/MM/YYYY - hh:mm:ss') + ', ';
      csv += alert.thresholdAlert.sensorType.name + ' ' +
        this.alertsService.getAlertType(alert.sensorReading.value, alert.thresholdAlert.high, alert.thresholdAlert.low) +
        ', ';
      csv += alert.asset.thresholdTemplate.name + ', ';
      csv += alert.read;
      csv += '\n';
    }
    this.btnOptsExportAlerts.active = false;
    console.log(csv);
    this.sharedService.downloadCSV('csv export ' + moment().format('DD/MM/YYYY - hh:mm:ss'), csv);
  }

  private async getTranslation(label: string) {
    return await (this.translateService.get(label).toPromise());
  }

}
