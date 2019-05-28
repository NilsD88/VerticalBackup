import {isNullOrUndefined} from "util";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  impersonation: boolean;
  roles: string[];
}

export class User implements IUser {
  public firstName: string;
  public email: string;
  public lastName: string;
  public impersonation: boolean;
  public roles: string[];

  constructor(private _user: IUser) {
    try {
      this.firstName = _user.firstName ? _user.firstName : '';
      this.lastName = _user.lastName ? _user.lastName : '';
      this.email = _user.email ? _user.email : '';
      this.impersonation = _user.impersonation ? _user.impersonation : false;
      this.roles = (_user.roles && _user.roles.length) ? _user.roles : [];
    } catch (err) {
      console.error('UserModel: Invalid user model, cannot create user from passed object');
    }
  }

  public static createArray(values: IUser[]) {
    if (!isNullOrUndefined(values)) {
      return values.map((value) => {
        return new User(value);
      });
    } else {
      return [];
    }
  }

  get isAdmin(): boolean {
    return this.roles.indexOf('iotap_localadmin') >= 0;
  }

  get isUser(): boolean {
    return !isNullOrUndefined(this.roles);
  }

  get exists(): boolean {
    return !isNullOrUndefined(this._user) && !isNullOrUndefined(this._user.roles);
  }
}
