import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {SharedService} from './shared.service';
import {environment} from '../../environments/environment';
import {isNullOrUndefined} from 'util';

export interface SensorReadingFilter {
  deveui: string;
  sensortypeid: number | string;
  from: number;
  to: number;
  interval: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
}

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  constructor(public http: HttpClient,
              public snackBar: MatSnackBar,
              public sharedService: SharedService) {
  }

  getSensorReadings(filter: SensorReadingFilter) {
    return new Promise(async (resolve, reject) => {
      this.http.get(
        `${environment.baseUrl}sensorreadings?deveui=${filter.deveui}&sensortypeid=${filter.sensortypeid}&interval=${filter.interval}
          &from=${filter.from}&to=${filter.to}`)
        .subscribe((response: any) => {
          if (!isNullOrUndefined(response)) {
            resolve(response);
          } else {
            this.sharedService.rejectPromise('LogsService: Invalid server response', reject);
          }
        }, () => {
          this.sharedService.rejectPromise('Error! Failed to fetch sensor data. Please retry.', reject);
        });
    });
  }

  getStandardDeviation(filter: SensorReadingFilter) {
    return new Promise(async (resolve, reject) => {
      this.http.get(
        `${environment.baseUrl}sensorreadings/standarddeviation?deveui=${filter.deveui}&sensortypeid=${filter.sensortypeid}&from=${filter.from}&to=${filter.to}`)
        .subscribe((response: any) => {
          if (!isNullOrUndefined(response)) {
            resolve(response);
          } else {
            this.sharedService.rejectPromise('LogsService: Invalid server response', reject);
          }
        }, () => {
          this.sharedService.rejectPromise('Error! Failed to fetch standard deviation data. Please retry.', reject);
        });
    });
  }
}
