import {isNullOrUndefined} from 'util';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  impersonation: boolean;
  modules: string[];
  roles: string[];
  orgName: string;
}

export class User implements IUser {
  public firstName: string;
  public email: string;
  public lastName: string;
  public impersonation: boolean;
  public roles: string[];
  public modules: string[] = [];
  public orgName: string;

  constructor(private user: IUser) {
    console.log(user);
    try {
      this.firstName = user.firstName ? user.firstName : '';
      this.lastName = user.lastName ? user.lastName : '';
      this.email = user.email ? user.email : '';
      this.impersonation = user.impersonation ? user.impersonation : false;
      this.roles = (user.roles && user.roles.length) ? user.roles : [];
      this.modules = user.modules ? user.modules : [];
      this.orgName = user.orgName ? user.orgName : '';
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
    return this.roles.indexOf('pxs:iot:localadmin') >= 0;
  }

  get isUser(): boolean {
    return !isNullOrUndefined(this.roles);
  }

  get exists(): boolean {
    return !isNullOrUndefined(this.user) && !isNullOrUndefined(this.user.roles);
  }

  public hasModule(feature: string): boolean {
    return this.modules.indexOf(feature) >= 0;
  }
}
