import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {SharedService} from './shared.service';
import {isNullOrUndefined} from 'util';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import { Observable } from 'rxjs';

export interface SensorReadingFilter {
  deveui: string;
  sensortypeid: number | string;
  from: number;
  to: number;
  interval: 'ALL' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
}

export interface IAggregatedValue {
  sensorType: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  constructor(
    public http: HttpClient,
    public snackBar: MatSnackBar,
    public sharedService: SharedService,
    public translateService: TranslateService,
    public authService: AuthService,
    public router: Router
  ) {}

  getSensorReadings(filter: SensorReadingFilter) {
    return new Promise(async (resolve, reject) => {
      const failedMessage = await this.translateService.get('DETAIL.ERROR.FAIL').toPromise();
      const errorMessage = await this.translateService.get('DETAIL.ERROR.DATA').toPromise();
      this.http.get(
        `https://www-uat.proximus.be/smartapps/smartmonitoring/api/sensorreadings?deveui=${filter.deveui}&sensortypeid=${filter.sensortypeid}&interval=${filter.interval}&from=${filter.from}&to=${filter.to}`)
        .subscribe((response: any) => {
          if (!isNullOrUndefined(response)) {
            resolve(response);
          } else {
            this.sharedService.rejectPromise('LogsService: ' + failedMessage, reject);
          }
        }, (err) => {
          if (err.status === 410) {
            console.error(err);
          } else {
            this.sharedService.rejectPromise(errorMessage, reject);
          }
        });
    });
  }

  getSensorReadingsV2(filter: SensorReadingFilter) {
    return new Promise(async (resolve, reject) => {
      const failedMessage = await this.translateService.get('DETAIL.ERROR.FAIL').toPromise();
      const errorMessage = await this.translateService.get('DETAIL.ERROR.DATA').toPromise();
      this.http.get(
        `https://www-uat.proximus.be/smartapps/smartmonitoring/api/sensorreadings/v2?deveui=${filter.deveui}&sensortypeid=${filter.sensortypeid}&aggregationtype=none&from=${filter.from}&to=${filter.to}`)
        .subscribe((response: any) => {
          if (!isNullOrUndefined(response)) {
            resolve(response);
          } else {
            this.sharedService.rejectPromise('LogsService: ' + failedMessage, reject);
          }
        }, (err) => {
          if (err.status === 410) {
            console.error(err);
          } else {
            this.sharedService.rejectPromise(errorMessage , reject);
          }
        });
    });
  }

  public getStandardDeviation(filter: SensorReadingFilter): Observable <IAggregatedValue> {
    return this.http.get <IAggregatedValue> (`https://www-uat.proximus.be/smartapps/smartmonitoring/api/sensorreadings/standarddeviation?deveui=${filter.deveui}&sensortypeid=${filter.sensortypeid}&from=${filter.from}&to=${filter.to}`);
  }
}
