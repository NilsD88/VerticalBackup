import {isNullOrUndefined} from 'util';

export interface IOrganization {
  id: string | number;
  name?: string;
}

export class Organization implements IOrganization {
  id: string | number;
  name?: string;

  constructor(private _organization: IOrganization) {
    if (!isNullOrUndefined(_organization)) {
      this.id = _organization.id;
      this.name = _organization.name;
    } else {
      this.id = null;
      this.name = '';
    }
  }

  public static createArray(values: IOrganization[]): Organization[] {
    if (!isNullOrUndefined(values)) {
      return values.map((val) => {
        return new Organization(val);
      });
    } else {
      return [];
    }
  }
}
