import {IOrganization, Organization} from './organization.model';
import {isNullOrUndefined} from 'util';
import {IThing, Thing} from './thing.model';
import {Asset, IAsset} from './asset.model';

export interface ISublocation {
  id: string | number;
  name: string;
  pictureBase64: string;

  assets?: IAsset[];
  location?: ILocation;
  things?: IThing[];
}

export class Sublocation implements ISublocation {
  id: string | number;
  name: string;
  pictureBase64: string;

  assets: IAsset[];
  location: ILocation;
  things: Thing[];

  constructor(private _sublocation: ISublocation) {
    if (!isNullOrUndefined(_sublocation)) {
      this.id = !isNullOrUndefined(_sublocation.id) ? _sublocation.id : null;
      this.name = _sublocation.name ? _sublocation.name : '';
      this.pictureBase64 = _sublocation.pictureBase64 ? _sublocation.pictureBase64 : '';
    } else {
      this.id = null;
      this.name = '';
      this.pictureBase64 = '';
    }

    this.assets = Asset.createArray(_sublocation ? _sublocation.assets : null);
    this.location = new Location(_sublocation ? _sublocation.location : null);
    this.things = Thing.createArray(_sublocation ? _sublocation.things : null);
  }

  public static createArray(values: ISublocation[]): Sublocation[] {
    if (!isNullOrUndefined(values)) {
      return values.map((val) => {
        return new Sublocation(val);
      });
    }
  }

  public assemble() {
    return {
      locationId: this.location.id,
      id: this.id,
      name: this.name,
      pictureBase64: this.pictureBase64
    };
  }
}

export interface ILocation {
  id?: string | number;
  name: string;
  organization: IOrganization;
  organizationId: string | number;
  locationType: ILocationType;
  locationTypeId: string | number;
  sublocations?: ISublocation[];
}

export class Location implements ILocation {
  id?: string | number;
  name: string;
  organization: Organization;
  organizationId: string | number;
  locationType: LocationType;
  locationTypeId: string | number;
  sublocations?: Sublocation[];

  constructor(private _location: ILocation) {
    if (!isNullOrUndefined(_location)) {
      this.id = !isNullOrUndefined(_location.id) ? _location.id : null;
      this.name = _location.name ? _location.name : '';
    } else {
      this.id = null;
      this.name = '';
    }
    this.organization = new Organization(_location ? _location.organization : null);
    if (_location != null) {
      this.organizationId = _location.organization ? _location.organization.id : null;
    }
    this.locationType = new LocationType(_location ? _location.locationType : null);
    if (_location != null) {
      this.locationTypeId = _location.locationType ? _location.locationType.id : null;
    }
    this.sublocations = Sublocation.createArray(_location ? _location.sublocations : null);
  }

  public static createArray(values: ILocation[]): Location[] {
    if (!isNullOrUndefined(values)) {
      return values.map((value) => {
        return new Location(value);
      });
    } else {
      return [];
    }
  }
}

export interface ILocationType {
  id: string | number;
  name: string;
}

export class LocationType implements ILocationType {
  public id: string | number;
  public name: string;

  constructor(private _locationType: ILocationType) {
    if (!isNullOrUndefined(_locationType)) {
      this.id = !isNullOrUndefined(_locationType.id) ? _locationType.id : null;
      this.name = !isNullOrUndefined(_locationType.name) ? _locationType.name : '';
    } else {
      this.id = null;
      this.name = '';
    }
    delete this._locationType;
  }

  public static createArray(values: ILocationType[]): LocationType[] {
    if (!isNullOrUndefined(values)) {
      return values.map((value) => {
        return new LocationType(value);
      });
    } else {
      return [];
    }
  }
}








