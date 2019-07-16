import {isNullOrUndefined} from 'util';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  impersonation: boolean;
  features: Array<'fill' | 'counting' | 'tracking'>;
  roles: string[];
}

export class User implements IUser {
  public firstName: string;
  public email: string;
  public lastName: string;
  public impersonation: boolean;
  public roles: string[];
  public features = [];

  constructor(private user: IUser) {
    try {
      this.firstName = user.firstName ? user.firstName : '';
      this.lastName = user.lastName ? user.lastName : '';
      this.email = user.email ? user.email : '';
      this.impersonation = user.impersonation ? user.impersonation : false;
      this.roles = (user.roles && user.roles.length) ? user.roles : [];
      this.features = ['fill'];
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
    return !isNullOrUndefined(this.user) && !isNullOrUndefined(this.user.roles);
  }
}
