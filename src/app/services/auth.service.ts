import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {IUser, User} from 'src/app/models/user.model';
import {Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    public http: HttpClient,
    public router: Router,
    @Inject(DOCUMENT) private document: any
  ) {
  }

  public isLoggedIn(): Promise<User> {
    return new Promise((resolve, reject) => {
      try {
        this.http.get(`${environment.authUrl}checksession`, {withCredentials: true})
          .subscribe((result: IUser) => {
            window.localStorage.setItem('user', JSON.stringify(result));
            resolve(new User(result));
          }, reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  public logout() {
    this.document.location.href = environment.authUrl + 'logout';
  }

  public login() {
    this.document.location.href = environment.loginUrl;
  }
}
