import { MOCK_THINGS } from './../mocks/things';
import { MOCK_LOCATIONS_FLAT } from './../mocks/newlocations';
import { MOCK_ASSETS } from './../mocks/newasset';
import { InMemoryDbService, ResponseOptions } from 'angular-in-memory-web-api';
import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MOCK_LOCATIONS } from '../mocks/newlocations';
import { INewLocation } from '../models/new-location';
import { INewAsset } from '../models/new-asset.model';
import { ISensorType } from '../models/sensor.model';
import { MOCK_SENSORTYPES } from '../mocks/sensortypes';
import { IThing } from '../models/thing.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {

  httpClient: HttpClient;

  createDb() {
    const db: {
      locations: INewLocation[],
      assets: INewAsset[],
      locationsFlat: INewLocation[],
      things: IThing[],
    } = {locations: [], assets: [], locationsFlat: [], things: []};

    this.httpClient = this.inject.get(HttpClient);
    db.locations =  MOCK_LOCATIONS;
    db.locationsFlat = MOCK_LOCATIONS_FLAT;
    db.assets = MOCK_ASSETS;
    db.things = MOCK_THINGS;
    return db;
  }

  constructor(private inject: Injector) {}
}
