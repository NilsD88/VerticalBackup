import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {SharedService} from './shared.service';
import {environment} from 'src/environments/environment';
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
    return this.http.get(`${environment.baseUrl}sensorreadings?deveui=${filter.deveui}&sensortypeid=${filter.sensortypeid}&interval=${filter.interval}&from=${filter.from}&to=${filter.to}`);
  }

  getSensorReadingsV2(filter: ISensorReadingFilter) {
    return this.http.get(`${environment.baseUrl}sensorreadings/v2?deveui=${filter.deveui}&sensortypeid=${filter.sensortypeid}&aggregationtype=none&from=${filter.from}&to=${filter.to}`);
  }

  getStandardDeviation(filter: ISensorReadingFilter) {
    console.log('getStandardDeviation', filter);
    return this.http.get(`${environment.baseUrl}sensorreadings/standarddeviation?deveui=${filter.deveui}&sensortypeid=${filter.sensortypeid}&from=${filter.from}&to=${filter.to}`)
  }
}
