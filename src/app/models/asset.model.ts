import {ILocation} from './location.model';
import {IGeolocation} from './geolocation.model';
import {IThresholdTemplate} from './threshold-template.model';
import {IThing} from './thing.model';
import {isNullOrUndefined} from 'util';
import {IAlert} from './alert.model';
import { ICustomField } from './field.model';

export interface IAbstractAsset<TLocation> {
  id?: string;
  name?: string;
  description?: string;
  overwriteGPS?: Boolean;
  location?: TLocation;
  locationId?: string;
  geolocation?: IGeolocation;
  image?: string;
  thresholdTemplate?: IThresholdTemplate;
  thresholdTemplateId?: string;
  things?: IThing[];
  thingIds?: string[];
  alerts?: IAlert[];
  customFields?: ICustomField[];
  module?: string;
  lastAlert?: any;
}

export interface IAsset extends IAbstractAsset <ILocation> {

}

export class Asset {
  id: string;
  name: string;
  description: string;
  overwriteGPS: Boolean;
  location: ILocation;
  locationId: string;
  geolocation: IGeolocation;
  image: string;
  thresholdTemplate: IThresholdTemplate;
  thresholdTemplateId: string;
  things: IThing[] = [];
  thingsId: string[];
  lastAlert: any;
  customFields?: ICustomField[] = [];
  module: string;

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
