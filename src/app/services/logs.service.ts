import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {SharedService} from './shared.service';
import {isNullOrUndefined} from 'util';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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
  ) {}

  public getStandardDeviation(filter: SensorReadingFilter): Observable <IAggregatedValue> {
    return this.http.get <IAggregatedValue> (`${environment.baseUrl}/sensorreadings/standarddeviation?deveui=${filter.deveui}&sensortypeid=${filter.sensortypeid}&from=${filter.from}&to=${filter.to}`);
  }
}
