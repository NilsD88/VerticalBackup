import { MOCK_THRESHOLD_TEMPLATES_PAGED, MOCK_THRESHOLD_TEMPLATES } from './../mocks/threshold-templates';
import { MOCK_THINGS } from './../mocks/things';
import { MOCK_ASSETS } from './../mocks/newasset';
import { InMemoryDbService, ResponseOptions } from 'angular-in-memory-web-api';
import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MOCK_LOCATIONS } from '../mocks/newlocations';
import { ILocation } from '../models/g-location.model';
import { IAsset } from '../models/g-asset.model';
import { IThing } from '../models/thing.model';
import { IThresholdTemplate } from '../models/g-threshold-template.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {

  httpClient: HttpClient;

  createDb() {
    const db: {
      locations: ILocation[],
      assets: IAsset[],
      things: IThing[],
      thresholdTemplates: IThresholdTemplate[],
    } = {
      locations: [],
      assets: [],
      things: [],
      thresholdTemplates: []
    };

    this.httpClient = this.inject.get(HttpClient);
    db.locations =  MOCK_LOCATIONS;
    db.assets = MOCK_ASSETS;
    db.things = MOCK_THINGS;
    db.thresholdTemplates = MOCK_THRESHOLD_TEMPLATES;
    return db;
  }

  constructor(private inject: Injector) {}
}
