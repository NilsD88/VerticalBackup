import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {SharedService} from './shared.service';
import {environment} from '../../environments/environment';
import {isNullOrUndefined} from 'util';
import { ISensorReadingFilter } from '../models/sensor.model';


@Injectable({
  providedIn: 'root'
})
export class LogsService {
  constructor(public http: HttpClient,
              public snackBar: MatSnackBar,
              public sharedService: SharedService) {
  }

  getSensorReadings(filter: ISensorReadingFilter) {
    return new Promise(async (resolve, reject) => {
      this.http.get(
        `${environment.baseUrl}sensorreadings?deveui=${filter.deveui}&sensortypeid=${filter.sensortypeid}&interval=${filter.interval}
          &from=${filter.from}&to=${filter.to}`)
        .subscribe((response: any) => {
          if (!isNullOrUndefined(response)) {
            console.log(response);
            resolve(response);
          } else {
            this.sharedService.rejectPromise('LogsService: Invalid server response', reject);
          }
        }, () => {
          this.sharedService.rejectPromise('Error! Failed to fetch sensor data. Please retry.', reject);
        });
    });
  }

  getSensorReadingsV2(filter: ISensorReadingFilter) {
    return new Promise(async (resolve, reject) => {
      this.http.get(
        `${environment.baseUrl}sensorreadings/v2?deveui=${filter.deveui}&sensortypeid=${filter.sensortypeid}&aggregationtype=none&from=${filter.from}&to=${filter.to}`)
        .subscribe((response: any) => {
          if (!isNullOrUndefined(response)) {
            resolve(response);
          } else {
            this.sharedService.rejectPromise('LogsService: Invalid server response', reject);
          }
        }, (err) => {
          if (err.status === 410) {
            this.sharedService.rejectPromise('Error! Your session has expired, please login again.', reject);
          } else {
            this.sharedService.rejectPromise('Error! Failed to fetch sensor data. Please retry.', reject);
          }
        });
    });
  }

  getStandardDeviation(filter: ISensorReadingFilter) {
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
