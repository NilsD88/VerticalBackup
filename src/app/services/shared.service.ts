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

  /*
     get windowWidth() {
       return Math.max(
         document.documentElement.clientWidth,
         document.body.scrollWidth,
         document.documentElement.scrollWidth,
         document.body.offsetWidth,
         document.documentElement.offsetWidth
       );
     }

     get xsScreen() {
       return this.windowWidth < 544;
     }

     get smScreen() {
       return this.windowWidth <= 544 && this.windowWidth < 768;
     }

     get mdScreen() {
       return this.windowWidth <= 768 && this.windowWidth < 992;
     }

     get lgScreen() {
       return this.windowWidth <= 992 && this.windowWidth < 1200;
     }

     get xlScreen() {
       return this.windowWidth > 1200;
     }

     public compareId(c1: any, c2: any): boolean {
       return c1 && c2 ? c1.id === c2.id : c1 === c2;
     }

     public getAlertType(value: number, high: number, low: number, raw?: boolean): 'ALERT_TYPE.high' | 'ALERT_TYPE.low' | 'high' | 'low' {
       if (value >= high) {
         if (raw) {
           return 'high';
         } else {
           return 'ALERT_TYPE.high';
         }
       }
       if (value <= low) {
         if (raw) {
           return 'low';
         } else {
           return 'ALERT_TYPE.low';
         }
       }
     }

     public buildFilterQuery(queries: string[]) {
       let query = '';
       for (let i = 0; i < queries.length; i++) {
         if (!isNullOrUndefined(queries[i])) {
           query += queries[i] + ';';
         }
       }
       query = query.length ? `?filter=${query}` : '';
       query = query.substring(0, query.length - 1);
       return query;
     }




     public filterInt(value: string) {
       if (/^(-|\+)?(\d+|Infinity)$/.test(value)) {
         return Number(value);
       }
       return NaN;
     }


     public detectIE() {
       const ua = window.navigator.userAgent;
       const msie = ua.indexOf('MSIE ');
       if (msie > 0) {
         // IE 10 or older => return version number
         return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
       }

       const trident = ua.indexOf('Trident/');
       if (trident > 0) {
         // IE 11 => return version number
         const rv = ua.indexOf('rv:');
         return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
       }

       const edge = ua.indexOf('Edge/');
       if (edge > 0) {
         // Edge (IE 12+) => return version number
         return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
       }

       // other browser
       return false;
     }
   */
}
