import { ILocationType } from './locations.model';
import { IGeolocation } from './asset.model';
import { isNullOrUndefined } from 'util';
import { INewAsset } from './new-asset.model';

export interface INewLocation {
  id: string | number;
  parentId: string | number;
  parent?: INewLocation;
  name: string;
  description: string;
  locationType: ILocationType;
  sublocationsId: number[];
  sublocations?: INewLocation[];
  image: string;
  geolocation: IGeolocation;
  assets?: INewAsset[];
}

export class NewLocation implements INewLocation {
  id: string | number;
  parentId: string | number;
  parent: INewLocation;
  name: string;
  description: string;
  locationType: ILocationType;
  sublocationsId: number[];
  sublocations?: INewLocation[];
  image: string;
  geolocation: IGeolocation;
  assets?: INewAsset[];


  constructor(private location: INewLocation) {
    if (!isNullOrUndefined(location)) {
      this.id =  !isNullOrUndefined(location.id) ? location.id : null;
      this.parentId = !isNullOrUndefined(location.parentId) ? location.parentId : null;
      this.parent = !isNullOrUndefined(location.parent) ? location.parent : null;
      this.name = !isNullOrUndefined(location.name) ? location.name : null;
      this.description = !isNullOrUndefined(location.description) ? location.description : null;
      this.locationType = !isNullOrUndefined(location.locationType) ? location.locationType : null;
      this.sublocations = !isNullOrUndefined(location.sublocations) ? location.sublocations : null;
      this.image = !isNullOrUndefined(location.image) ? location.image : null;
      this.geolocation = !isNullOrUndefined(location.geolocation) ? location.geolocation : null;
      this.assets = !isNullOrUndefined(location.assets) ? location.assets : null;
    }
    delete this.location;
  }
}
