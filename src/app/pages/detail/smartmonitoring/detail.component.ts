import {Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Asset} from '../../../models/asset.model';
import {AssetService} from '../../../services/asset.service';
import {isNullOrUndefined} from 'util';
import {SharedAlertsService} from '../../alerts/shared-alerts.service';
import {Alert} from '../../../models/alert.model';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import { ISensorReadingFilter } from 'src/app/models/sensor.model';
import { LogsService } from 'src/app/services/logs.service';

interface IFilterChartData {
  interval?: string;
  from?: number;
  to?: number;
}

@Component({
  selector: 'pvf-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  public asset: Asset;
  public lastAlert: Alert;
  public chartSensorOptions = [];
  public chartLoading = false;
  public chartData = [];
  public chartDateRange = {fromDate: moment(new Date()).startOf('d').toDate(), toDate: moment(new Date()).endOf('d').toDate()};
  public standardDeviations = [];
  
  public currentFilter: IFilterChartData = {
    interval: "HOURLY",
    from: this.chartDateRange.fromDate.getTime(),
    to: this.chartDateRange.toDate.getTime(),
  }

  public mapLayers = [];

  public mapConfig;

  constructor(public activeRoute: ActivatedRoute,
              private assetService: AssetService,
              private router: Router,
              private translateService: TranslateService,
              private logsService: LogsService,
              public sharedAlertsService: SharedAlertsService) {
                activeRoute.params.subscribe(val => {
                  this.init();
                });
  }


  async ngOnInit() {
  }

  async init() {
    try {
      const id = await this.getRouteId();
      const assetPromise = this.assetService.getAssetById(id);
      const lastAlertPromise = this.sharedAlertsService.getLastAlertByAssetId(id);
      this.asset = await assetPromise;
      this.lastAlert = await lastAlertPromise;
      this.chartSensorOptions = this.asset.sensors ? this.asset.sensors.map((val) => {
        return {
          deveui: val.devEui,
          sensorTypeId: val.sensorType.id
        };
      }) : [];
      this.getChartData(null);
      this.createMarkerOnMap();

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


  public async getChartData(options:{interval?:string; from?:number; to?:number;}) {

    let shouldUpdate = false;
    
    if(!options) {
      shouldUpdate = true;
      options = this.currentFilter;
    }

    const interval = options.interval ?  options.interval : this.currentFilter.interval;
    const from = options.from ?  options.from : this.currentFilter.from;
    const to = options.to ?  options.to : this.currentFilter.to;

    if(interval !== this.currentFilter.interval) {
      shouldUpdate = true;
    } else if(from < this.currentFilter.from || to > this.currentFilter.to) {
      shouldUpdate = true;
    }

    if(!shouldUpdate) {
      console.log("not update");
      return false;
    }

    console.log("have to update");

    this.currentFilter = {
      interval,
      from,
      to
    }
    
    this.chartLoading = true;
    const logsPromises = [];
    const standardDeviationPromises = [];

    for (const sensorType of this.chartSensorOptions) {
      const filter:ISensorReadingFilter = {
        deveui: sensorType.deveui,
        sensortypeid: sensorType.sensorTypeId,
        from,
        to,
        interval,
      };
      logsPromises.push(this.logsService.getSensorReadings(filter));
      standardDeviationPromises.push(this.logsService.getStandardDeviation(filter));
    }

    this.standardDeviations = await Promise.all(standardDeviationPromises);
    this.chartData = await Promise.all(logsPromises);
    this.chartLoading = false;
  }



  public createMarkerOnMap() {
    /*const m = marker(, {
      icon: icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE4LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMzY1IDU2MCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMzY1IDU2MCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPHBhdGggZmlsbD0iIzAwQUVFRiIgZD0iTTE4Mi45LDU1MS43YzAsMC4xLDAuMiwwLjMsMC4yLDAuM1MzNTguMywyODMsMzU4LjMsMTk0LjZjMC0xMzAuMS04OC44LTE4Ni43LTE3NS40LTE4Ni45ICAgQzk2LjMsNy45LDcuNSw2NC41LDcuNSwxOTQuNmMwLDg4LjQsMTc1LjMsMzU3LjQsMTc1LjMsMzU3LjRTMTgyLjksNTUxLjcsMTgyLjksNTUxLjd6IE0xMjIuMiwxODcuMmMwLTMzLjYsMjcuMi02MC44LDYwLjgtNjAuOCAgIGMzMy42LDAsNjAuOCwyNy4yLDYwLjgsNjAuOFMyMTYuNSwyNDgsMTgyLjksMjQ4QzE0OS40LDI0OCwxMjIuMiwyMjAuOCwxMjIuMiwxODcuMnoiLz4KPC9nPgo8L3N2Zz4='
      }).bindPopup(
        `
        <h6>${this.asset.name}</h6>
        `
      )
    });*/
  }

}
