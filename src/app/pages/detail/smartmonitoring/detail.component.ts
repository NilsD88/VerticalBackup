import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Asset} from '../../../models/asset.model';
import {AssetService} from '../../../services/asset.service';
import {isNullOrUndefined} from 'util';
import {SharedAlertsService} from '../../alerts/shared-alerts.service';
import {Alert} from '../../../models/alert.model';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import * as numeral from 'numeral';
import {Sensor} from '../../../models/sensor.model';
import {TranslateService} from '@ngx-translate/core';
import {LogsService} from '../../../services/logs-service.service';

declare var require: any;
declare var chart: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);
require('highcharts/modules/no-data-to-display')((Highcharts));

export interface SensorReadingFilter {
  deveui: string;
  sensortypeid: number | string;
  from: number;
  to: number;
  interval: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
}

@Component({
  selector: 'pvf-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  public asset: Asset;
  public lastAlert: Alert;
  public Highcharts = Highcharts; // required
  public chartConstructor = 'list-image.png'; // optional string, defaults to 'chart'
  public chartOptions = {
    chart: {
      zoomType: 'xy'
    },
    exporting: {
      csv: {
        dateFormat: '%d-%m-%Y %H:%M:%S'
      },
      enabled: true
    },
    yAxis: [{ // Temperature yAxis
      opposite: false,
      showEmpty: false,
      title: {
        text: 'Temperature'
      },
      softMin: 0,
      softMax: 40
    }, { // humidity yAxis
      opposite: true,
      showEmpty: false,
      title: {
        text: 'Humidity'
      },
      softMin: 0,
      softMax: 100
    }, { // Luminosity yAxis
      opposite: false,
      showEmpty: false,
      title: {
        text: 'Luminosity'
      },
      softMin: 0,
      softMax: 500
    }, { // motion yAxis
      opposite: true,
      showEmpty: false,
      title: {
        text: 'Motion'
      },
      softMin: 0,
      softMax: 1000
    }],
    xAxis: {
      type: 'datetime'
    },
    credits: {
      enabled: false
    },
    title: {
      text: 'Detail chart'
    },
    tooltip: {
      crosshairs: true,
      shared: true
    },

    legend: {},

    series: []
  }; // required
  public chartLoading = false;
  public chartCallback = null; // optional function, defaults to null
  public updateFlag = false; // optional boolean
  public oneToOneFlag = true; // optional boolean, defaults to false

  public chartSensorOptions: Sensor[] = [];
  public chartConfig: { dateRange: any; chartSensors: { deveui: string; sensorTypeId: string }[]; chartType: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' } = {
    dateRange: {fromDate: moment(new Date()).startOf('d').toDate(), toDate: moment(new Date()).endOf('d').toDate()},
    chartSensors: [],
    chartType: 'HOURLY'
  };
  public chartTypes = [
    {
      label: 'DETAIL.CHARTTYPES.HOURLY',
      value: 'HOURLY'
    },
    {
      label: 'DETAIL.CHARTTYPES.DAILY',
      value: 'DAILY'
    },
    {
      label: 'DETAIL.CHARTTYPES.WEEKLY',
      value: 'WEEKLY'
    },
    {
      label: 'DETAIL.CHARTTYPES.MONTHLY',
      value: 'MONTHLY'
    },
    {
      label: 'DETAIL.CHARTTYPES.YEARLY',
      value: 'YEARLY'
    }];
  public selectedSensorTypes = [];

  public chartData: {
    label: string;
    series: {
      label: string;
      avg: number;
      min: number;
      max: number;
    }[];
  }[] = [];


  constructor(public activeRoute: ActivatedRoute,
              private assetService: AssetService,
              private router: Router,
              private translateService: TranslateService,
              private logsService: LogsService,
              public sharedAlertsService: SharedAlertsService) {
  }

  async ngOnInit() {
    try {
      const id = await this.getRouteId();
      const assetPromise = this.assetService.getAssetById(id);
      const lastAlertPromise = this.sharedAlertsService.getLastAlertByAssetId(id);
      this.asset = await assetPromise;
      this.lastAlert = await lastAlertPromise;
      this.chartSensorOptions = this.asset.sensors ? this.asset.sensors : [];
      this.selectedSensorTypes = this.chartSensorOptions.map((val) => {
        return {
          deveui: val.devEui,
          sensorTypeId: val.sensorType.id
        };
      });
      this.getChartData();
      Highcharts.chart('container', this.chartOptions as any);

      console.log(this.Highcharts);

    } catch (err) {
      this.router.navigate(['/error/404']);
    }
  }

  private getRouteId(): Promise<string | number> {
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

  // CHART

  public async getChartData() {
    this.chartLoading = true;
    const logsPromises = [];
    console.log(this.selectedSensorTypes);
    for (const sensorType of this.selectedSensorTypes) {
      const filter: SensorReadingFilter = {
        deveui: sensorType.deveui,
        sensortypeid: sensorType.sensorTypeId,
        from: this.chartConfig.dateRange.fromDate.getTime(),
        to: this.chartConfig.dateRange.toDate.getTime(),
        interval: this.chartConfig.chartType
      };
      logsPromises.push(this.logsService.getSensorReadings(filter));
    }
    this.chartData = await Promise.all(logsPromises);
    this.chartOptions.series = [];
    this.chartData.forEach(async (item) => {
      const rangeTranslation = await new Promise((resolve) => {
        this.translateService.get('SENSORTYPES.range').subscribe((result) => {
          resolve(result);
        });
      });
      const labelTranslation = await new Promise((resolve) => {
        this.translateService.get('SENSORTYPES.' + item.label).subscribe((result) => {
          resolve(result);
        });
      });
      this.chartOptions.series.push({
        name: labelTranslation,
        yAxis: this.getYAxisByLabel(item.label),
        zIndex: 1,
        data: item.series.map((serie) => {
          let label = this.filterInt(serie.label);
          if (label === NaN) {
            console.warn('Unable to perse timestamp for chart, using default value of 0');
            label = 0;
          }
          return [label, parseFloat(serie.avg.toFixed(2))];
        })
      });
      this.chartOptions.series.push({
        name: labelTranslation + ' ' + rangeTranslation,
        type: 'arearange',
        yAxis: this.getYAxisByLabel(item.label),
        lineWidth: 0,
        linkedTo: ':previous',
        fillOpacity: 0.3,
        zIndex: 0,
        marker: {
          enabled: false
        },
        data: item.series.map((serie) => {
          let label = this.filterInt(serie.label);
          if (label === NaN) {
            console.warn('Unable to perse timestamp for chart, using default value of 0');
            label = 0;
          }
          return [label, parseFloat(serie.min.toFixed(2)), parseFloat(serie.max.toFixed(2))];
        })
      });
    });
    this.updateFlag = true;
    this.chartLoading = false;
  }

  public filterInt(value: string) {
    if (/^(-|\+)?(\d+|Infinity)$/.test(value)) {
      return Number(value);
    }
    return NaN;
  }

  public getYAxisByLabel(label: string) {
    switch (label) {
      case 'temperature':
        return 0;
      case 'humidity':
        return 1;
      case 'luminosity':
        return 2;
      case 'motion':
        return 3;
    }
  }
}
