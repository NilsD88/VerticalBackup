import { MOCK_THRESHOLD_TEMPLATES_PAGED, MOCK_THRESHOLD_TEMPLATES } from './../mocks/threshold-templates';
import { MOCK_THINGS } from './../mocks/things';
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
import { INewThresholdTemplate } from '../models/new-threshold-template.model';
import { ThresholdTemplate, IPagedThresholdTemplates } from '../models/threshold.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {

  httpClient: HttpClient;

  createDb() {
    const db: {
      locations: INewLocation[],
      assets: INewAsset[],
      things: IThing[],
      thresholdTemplatesPaged: any | IPagedThresholdTemplates,
      thresholdTemplates: INewThresholdTemplate[],
    } = {
      locations: [],
      assets: [],
      things: [],
      thresholdTemplatesPaged: {},
      thresholdTemplates: []
    };

    this.httpClient = this.inject.get(HttpClient);
    db.locations =  MOCK_LOCATIONS;
    db.assets = MOCK_ASSETS;
    db.things = MOCK_THINGS;
    db.thresholdTemplatesPaged = MOCK_THRESHOLD_TEMPLATES_PAGED;
    db.thresholdTemplates = MOCK_THRESHOLD_TEMPLATES;
    return db;
  }

  constructor(private inject: Injector) {}
}
