import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {isNullOrUndefined} from 'util';
import {User} from 'src/app/models/user.model';
import {promise} from 'selenium-webdriver';
import IRejectedCallback = promise.IRejectedCallback;
import {MatSnackBar, MatSnackBarRef} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public get baseUrl() {
    return environment.baseUrl;
  }

  public user: User;

  constructor(
    public snackBar: MatSnackBar,
    public translate: TranslateService
  ) {
    this.user = JSON.parse(window.localStorage.getItem('user'));
  }

  public rejectPromise(message: string, reject: IRejectedCallback) {
    reject(new Error(message));
    return this.snackBar.open(
      message,
      null, {
        duration: 3000,
        panelClass: 'error-snackbar'
      });
  }

  public buildFilterQuery(queries: string[]) {
    let query = '';
    for (const q of queries) {
      if (!isNullOrUndefined(q)) {
        query += q + ';';
      }
    }
    query = query.length ? `?filter=${query}` : '';
    query = query.substring(0, query.length - 1);
    return query;
  }

  public downloadCSV(filename, text) {
    const element = document.createElement('a');
    filename += '.csv';
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  public showNotification(
    message: string,
    type: 'error' | 'warning' | 'success' | 'info' | 'primary',
    duration?: number,
    action?: string
    ): MatSnackBarRef<any> {
    return this.snackBar.open(
      message,
      action, {
        duration,
        panelClass: `${type}-snackbar`
      }
    );
  }

  public getDefaultFilter(type: 'ALERTFILTER' | 'INVENTORYFILTER' | 'LOCATIONSFILTER'): any {
    return JSON.parse(localStorage.getItem(type));
  }

  public setDefaultFilter(type: 'ALERTFILTER' | 'INVENTORYFILTER' | 'LOCATIONSFILTER', filter: any) {
    return localStorage.setItem(type, JSON.stringify(filter));
  }
}
