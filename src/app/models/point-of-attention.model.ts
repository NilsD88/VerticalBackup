import {
  ILocation
} from 'src/app/models/g-location.model';
import {
  IAsset
} from 'src/app/models/g-asset.model';
import {
  ISensorType
} from 'src/app/models/g-sensor-type.model';
import {
  isNullOrUndefined
} from 'util';

export interface IPointOfAttention {
  id?: string;
  name?: string;
  description?: string;
  location?: ILocation;
  locationId?: string;
  items?: IPointOfAttentionItem[];
}

export interface IPointOfAttentionItem {
  id?: string;
  name?: string;
  sensorType?: ISensorType;
  sensorTypeId?: string;
  aggregationType?: EAggregation;
  assets?: IAsset[];
  assetIds?: string[];
  tempId?: number;
  series?: IPointOfAttentionItemData[];
}

export enum EAggregation {
    SUM = 'SUM',
    AVG = 'AVG',
    MIN = 'MIN',
    MAX = 'MAX'
}

interface IPointOfAttentionItemData {
    timestamp: number;
    value: number;
}

export class PointOfAttentionItem implements IPointOfAttentionItem {
  id?: string;
  name?: string;
  sensorType?: ISensorType;
  aggregationType?: EAggregation;
  assets?: IAsset[] = [];
  series?: IPointOfAttentionItemData[] = [];

  constructor(pointOfAttentionItem: IPointOfAttentionItem = null) {
    if (pointOfAttentionItem) {
      for (const key in pointOfAttentionItem) {
        if (!isNullOrUndefined(key)) {
          this[key] = pointOfAttentionItem[key];
        }
      }
    }
  }
}
