import { ILocationType } from './locations.model';
import { IGeolocation } from './asset.model';
import { isNullOrUndefined } from 'util';
import { INewAsset } from './new-asset.model';

export interface INewLocation {
  id: string | number;
  parentId: string | number;
  parent?: INewLocation;
  name: string;
  locationType: ILocationType;
  sublocationsId: number[];
  sublocations?: INewLocation[];
  floorPlan: string;
  geolocation: IGeolocation;
  assets?: INewAsset[];
}

export class NewLocation implements INewLocation {
  id: string | number;
  parentId: string | number;
  parent: INewLocation;
  name: string;
  locationType: ILocationType;
  sublocationsId: number[];
  sublocations?: INewLocation[];
  floorPlan: string;
  geolocation: IGeolocation;
  assets?: INewAsset[];


  constructor(private _locatiton: INewLocation) {
    if (!isNullOrUndefined(_locatiton)) {
      this.id =  !isNullOrUndefined(_locatiton.id) ? _locatiton.id : null;
      this.parentId = !isNullOrUndefined(_locatiton.parentId) ? _locatiton.parentId : null;
      this.parent = !isNullOrUndefined(_locatiton.parent) ? _locatiton.parent : null;
      this.name = !isNullOrUndefined(_locatiton.name) ? _locatiton.name : null;
      this.locationType = !isNullOrUndefined(_locatiton.locationType) ? _locatiton.locationType : null;
      this.sublocations = !isNullOrUndefined(_locatiton.sublocations) ? _locatiton.sublocations : null;
      this.floorPlan = !isNullOrUndefined(_locatiton.floorPlan) ? _locatiton.floorPlan : null;
      this.geolocation = !isNullOrUndefined(_locatiton.geolocation) ? _locatiton.geolocation : null;
      this.assets = !isNullOrUndefined(_locatiton.assets) ? _locatiton.assets : null;
    }
  }
}
