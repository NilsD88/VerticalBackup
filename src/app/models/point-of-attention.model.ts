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
  aggregation?: EAggregation;
  assets?: IAsset[];
  tempId?: number;
}

export enum EAggregation {
    SUM = 'SUM',
    AVG = 'AVG',
    MIN = 'MIN',
    MAX = 'MAX'
}

export class PointOfAttentionItem implements IPointOfAttentionItem {
  id?: string;
  name?: string;
  sensorType?: ISensorType;
  aggregation?: EAggregation;
  assets?: IAsset[] = [];

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
