import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {SensorType} from '../models/sensor.model';
import {SharedService} from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private http: HttpClient, public sharedService: SharedService) {
  }

  public getSensorTypes(all?: boolean): Promise<SensorType[]> {
    console.log('getting sensor types');
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
}
