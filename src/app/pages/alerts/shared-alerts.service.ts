import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as moment from 'moment';
import {isNullOrUndefined} from 'util';
import {SharedService} from '../../services/shared.service';
import {Alert, IPagedAlerts} from '../../models/alert.model';

@Injectable({
  providedIn: 'root'
})
export class SharedAlertsService {

  constructor(private http: HttpClient, public sharedService: SharedService) {
  }

  public getAlertType(value: number | string, high: number | string, low: number | string, raw?: boolean): 'ALERT_TYPE.high' | 'ALERT_TYPE.low' | 'high' | 'low' {

    if (typeof value === 'string') {
      value = parseFloat(value);
    }
    if (typeof high === 'string') {
      high = parseFloat(high);
    }
    if (typeof low === 'string') {
      low = parseFloat(low);
    }

    if (value >= high) {
      if (raw) {
        return 'high';
      } else {
        return 'ALERT_TYPE.high';
      }
    }
    if (value <= low) {
      if (raw) {
        return 'low';
      } else {
        return 'ALERT_TYPE.low';
      }
    }
  }

  public getPagedAlerts(filter: any, pageIndex: number, pageSize: number): Promise<IPagedAlerts> {
    const dateRangeQuery = `sensorReading.timestamp>=${moment(filter.dateRange.fromDate).startOf('day')};sensorReading.timestamp<=${moment(filter.dateRange.toDate).endOf('day')}`;
    const thresholdTemplateQuery =
      filter.thresholdTemplates.length ?
        `asset.thresholdTemplate.id=in=(${filter.thresholdTemplates.toString()})` :
        undefined;
    const readQuery = !isNullOrUndefined(filter.read) ?
      `read==${filter.read}` :
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
      readQuery,
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


}
