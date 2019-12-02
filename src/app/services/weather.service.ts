import { timestamp } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(public http: HttpClient) { }

   getWeatherForSpecificHour(latitude,longitude,timestamp):Observable<IWeatherGivenHour>{
    return this.http.get<IWeatherGivenHour>(`https://api.darksky.net/forecast/9296dad42e16449975d3402ff8bf8c06/${latitude},${longitude},${timestamp}?exclude=hourly,daily,flags`)

  }
}


export interface IWeatherGivenHour {
  latitude: number;
  longitude: number;
  timezone: string;
  currently: Currently;
  offset: number;
}

interface Currently {
  time: number;
  summary: string;
  icon: string;
  precipIntensity: number;
  precipProbability: number;
  precipType: string;
  temperature: number;
  apparentTemperature: number;
  dewPoint: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windGust: number;
  windBearing: number;
  cloudCover: number;
  uvIndex: number;
  visibility: number;
  ozone: number;
}