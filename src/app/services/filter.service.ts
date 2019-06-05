import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {SensorType} from '../models/sensor.model';
import {SharedService} from './shared.service';
import {ThresholdTemplate} from '../models/threshold.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private http: HttpClient, public sharedService: SharedService) {
  }

  public getSensorTypes(all?: boolean): Promise<SensorType[]> {
    return new Promise(async (resolve, reject) => {
      this.http.get(`${environment.baseUrl}sensortypes/`)
        .subscribe((response: any) => {
          resolve(SensorType.createArray(response.content.filter((type) => {
            if (all) {
              return true;
            } else {
              return type.name !== 'battery';
            }
          })));
        }, (err: HttpErrorResponse) => {
          this.sharedService.rejectPromise('Error! Failed to fetch sensortype data. Please reload.', reject);
        });
    });
  }

  public getThresholdTemplates(): Promise<ThresholdTemplate[]> {
    return new Promise(async (resolve, reject) => {
      this.http.get(`${environment.baseUrl}thresholdtemplates/`)
        .subscribe((response: any) => {
          resolve(ThresholdTemplate.createArray(response.content));
        }, (err) => {
          this.sharedService.rejectPromise('Error! Failed to fetch location threshold templates. Please reload.', reject);
        });
    });
  }
}
