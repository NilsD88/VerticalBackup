import { ILocationType } from './locations.model';
import { IGeolocation } from './asset.model';

export interface INewLocation {
  id: string | number;
  parentId: string | number;
  name: string;
  locationType: ILocationType;
  sublocations?: INewLocation[];
  floorPlan: string;
  geolocation: IGeolocation;
}


