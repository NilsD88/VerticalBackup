import { MOCK_LOCATIONS_FLAT } from './../mocks/newlocations';
import { MOCK_ASSETS } from './../mocks/newasset';
import { InMemoryDbService, ResponseOptions } from 'angular-in-memory-web-api';
import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MOCK_LOCATIONS } from '../mocks/newlocations';
import { INewLocation } from '../models/new-location';
import { INewAsset } from '../models/new-asset.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {

  httpClient: HttpClient;

  createDb() {
    const db: {
      locations: INewLocation[],
      assets: INewAsset[],
      locationsFlat: INewLocation[]
    } = {locations: [], assets: [], locationsFlat: []};

    this.httpClient = this.inject.get(HttpClient);
    db.locations =  MOCK_LOCATIONS;
    db.locationsFlat = MOCK_LOCATIONS_FLAT;
    db.assets = MOCK_ASSETS;
    return db;
  }

  constructor(private inject: Injector) {}
}
