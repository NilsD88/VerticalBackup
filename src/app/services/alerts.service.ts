import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as moment from 'moment';
import {MatSnackBar} from '@angular/material';
import {SharedService} from './shared.service';
import {environment} from '../../environments/environment';
import {Alert, IPagedAlerts} from '../models/alert.model';
import {isNullOrUndefined} from 'util';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(public http: HttpClient,
              public sharedService: SharedService,
              public snackBar: MatSnackBar) {
  }

  public markAlert(alertIds: (string | number)[], markAs: boolean): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.http.post(`${environment.baseUrl}alerts/mark?read=${markAs}&ids=${alertIds.toString()}`, null)
        .subscribe((response: any) => {
          this.snackBar.open(
            `Alert successfully marked as ${markAs ? 'read' : 'unread'}.`,
            null, {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          resolve(response);
        }, (err) => {
          this.sharedService.rejectPromise('Error! Failed to fetch asset data. Please reload.', reject);
        });
    });
  }

  public getAlerts(filter: any): Promise<Alert[]> {
    const dateRangeQuery = `sensorReading.timestamp>=${moment(filter.dateRange.fromDate).startOf('day').valueOf()};sensorReading.timestamp<=${moment(filter.dateRange.toDate).endOf('day').valueOf()}`;
    const thresholdTemplateQuery = filter.thresholdTemplates.length ? `asset.thresholdTemplate.id=in=(${filter.thresholdTemplates.toString()})` : undefined;
    const locationTypeQuery = filter.locationTypes.length ? `asset.sublocation.location.locationType.id=in=(${filter.locationTypes.toString()})` : undefined;
    const sensorTypesQuery = filter.sensorTypes.length ? `thresholdAlert.sensorType.id=in=(${filter.sensorTypes.toString()})` : undefined;
    const query = this.sharedService.buildFilterQuery([thresholdTemplateQuery, locationTypeQuery, dateRangeQuery, sensorTypesQuery]);
    const url = `${this.sharedService.baseUrl}alerts${query}`;

    return new Promise(async (resolve, reject) => {
      this.http.get(url)
        .subscribe((response: any) => {
          if (!isNullOrUndefined(response) && !isNullOrUndefined(response.content)) {
            resolve(Alert.createArray(response.content));
          } else {
            this.sharedService.rejectPromise('AlertsService getAlerts: Response.content is undefined', reject);
          }
        }, () => {
          this.sharedService.rejectPromise('Error! Failed to fetch alerts. Please reload.', reject);
        });
    });
  }

  public getPagedAlerts(filter: any, pageIndex: number, pageSize: number): Promise<IPagedAlerts> {
    const dateRangeQuery = `sensorReading.timestamp>=${moment(filter.dateRange.fromDate).startOf('day')};sensorReading.timestamp<=${moment(filter.dateRange.toDate).endOf('day')}`;
    const thresholdTemplateQuery =
      filter.thresholdTemplates.length ?
        `asset.thresholdTemplate.id=in=(${filter.thresholdTemplates.toString()})` :
        undefined;
    const locationTypeQuery =
      filter.locationTypes.length ?
        `asset.sublocation.location.locationType.id=in=(${filter.locationTypes.toString()})` :
        undefined;
    const sensorTypesQuery =
      filter.sensorTypes.length ?
        `thresholdAlert.sensorType.id=in=(${filter.sensorTypes.toString()})` :
        undefined;

    const query = this.sharedService.buildFilterQuery([
      thresholdTemplateQuery,
      locationTypeQuery,
      dateRangeQuery,
      sensorTypesQuery
    ]);

    const url =
      `${this.sharedService.baseUrl}alerts${query}${query ?
        '&' :
        '?'}page=${pageIndex}&size=${pageSize}&sort=sensorReading.timestamp,desc`;

    return new Promise(async (resolve, reject) => {
      this.http.get(url)
        .subscribe((response: any) => {
          if (!isNullOrUndefined(response) && !isNullOrUndefined(response.content)) {
            response = Alert.createPagedArray(response);
            resolve(response);
          } else {
            resolve({
              alerts: [],
              pageNumber: 0,
              totalElements: 0
            });
          }
        }, (err) => {
          this.sharedService.rejectPromise('Error! Failed to fetch alerts. Please reload.', reject);
        });
    });
  }

  public getPagedAlertByAssetId(assetId: string | number, pageIndex: number, pageSize: number): Promise<IPagedAlerts> {
    const url = `${this.sharedService.baseUrl}alerts?filter=asset.id==${assetId}&page=${pageIndex}&size=${pageSize}&sort=sensorReading.timestamp,desc`;

    return new Promise(async (resolve, reject) => {
      this.http.get(url)
        .subscribe((response: any) => {
          resolve(Alert.createPagedArray(response));
        }, (err) => {
          this.sharedService.rejectPromise('unable to fetch alerts. Please reload.', reject);
        });
    });
  }

  public getUnreadAlerts(): Promise<Alert[]> {

    return new Promise(async (resolve, reject) => {
      this.http.get(`${environment.baseUrl}alerts?filter=read==false&sort=sensorReading.timestamp,desc`)
        .subscribe((response: any) => {
          if (!isNullOrUndefined(response)) {
            resolve(Alert.createArray(response.content));
          } else {
            resolve(Alert.createArray(response.content));
            console.warn(
              'AlertsService: getUnreadAlerts => Response is null or undefined. ' +
              'Resolving with default empty array.'
            );
          }
        }, (err) => {
          this.sharedService.rejectPromise('Unable to fetch unread alerts.', reject);
        });
    });
  }

  public getTodayAlerts(): Promise<Alert[]> {
    return new Promise(async (resolve, reject) => {
      this.http.get(`${environment.baseUrl}alerts?filter=sensorReading.timestamp>=${moment().startOf('day')}
      &sort=sensorReading.timestamp,desc`
      ).subscribe((response: any) => {
        resolve(Alert.createArray(response.content));
      }, (err) => {
        this.sharedService.rejectPromise('Unable to fetch today\'s alerts.', reject);
      });
    });
  }
}
