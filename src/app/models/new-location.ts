import { ILocationType } from './locations.model';
import { IGeolocation } from './asset.model';
import { isNullOrUndefined } from 'util';

export interface INewLocation {
  id: string | number;
  parentId: string | number;
  name: string;
  locationType: ILocationType;
  sublocations?: INewLocation[];
  floorPlan: string;
  geolocation: IGeolocation;
}

export class NewLocation implements INewLocation {
  id: string | number;
  parentId: string | number;
  name: string;
  locationType: ILocationType;
  sublocations?: INewLocation[];
  floorPlan: string;
  geolocation: IGeolocation;
  
  constructor(private _locatiton: INewLocation) {
    if (!isNullOrUndefined(_locatiton)) {
      this.id =  !isNullOrUndefined(_locatiton.id) ? _locatiton.id : null;
      this.parentId = !isNullOrUndefined(_locatiton.parentId) ? _locatiton.parentId : null;
      this.name = !isNullOrUndefined(_locatiton.name) ? _locatiton.name : null;
      this.locationType = !isNullOrUndefined(_locatiton.locationType) ? _locatiton.locationType : null;
      this.sublocations = !isNullOrUndefined(_locatiton.sublocations) ? _locatiton.sublocations : null;
      this.floorPlan = !isNullOrUndefined(_locatiton.floorPlan) ? _locatiton.floorPlan : null;
      this.geolocation = !isNullOrUndefined(_locatiton.geolocation) ? _locatiton.geolocation : null;
    } 
  }

}