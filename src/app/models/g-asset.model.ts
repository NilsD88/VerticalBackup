import {ILocation} from './g-location.model';
import {IGeolocation} from './geolocation.model';
import {IThresholdTemplate} from './g-threshold-template.model';
import {IThing} from './g-thing.model';
import {isNullOrUndefined} from 'util';
import {IAlert} from './g-alert.model';

export interface IAbstractAsset<TLocation> {
  id?: string;
  name?: string;
  description?: string;
  location?: TLocation;
  locationId?: string;
  geolocation?: IGeolocation;
  image?: string;
  thresholdTemplate?: IThresholdTemplate;
  thresholdTemplateId?: string;
  things?: IThing[];
  thingIds?: string[];
  alerts?: IAlert[];

  lastAlert?: any;
}

export interface IAsset extends IAbstractAsset <ILocation> {
  lastMeasurements: any;
}

export class Asset {
  id: string;
  name: string;
  description: string;
  location: ILocation;
  locationId: string;
  geolocation: IGeolocation;
  image: string;
  thresholdTemplate: IThresholdTemplate;
  thresholdTemplateId: string;
  things: IThing[] = [];
  thingsId: string[];

  lastAlert: any;

  constructor(asset: IAsset = null) {
    if (asset) {
      for (const key in asset) {
        if (!isNullOrUndefined(key)) {
          this[key] = asset[key];
        }
      }
    }
  }
}

export interface IPagedAssets {
  assets?: IAsset[];
  pageNumber?: number;
  totalElements?: number;
  totalPages?: number;
}
