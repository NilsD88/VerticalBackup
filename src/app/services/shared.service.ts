import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {isNullOrUndefined} from 'util';
import {User} from '../models/user.model';
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
    public translate: TranslateService,
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

  /* public rejectPromise(message: string, reject: IRejectedCallback) {
     reject(new Error(message));
     return this.snackBar.open(
       message,
       null, {
         duration: 3000,
         panelClass: 'error-snackbar'
       });
   }*/

  /* convertImageToCanvas(image): Promise<any> {
     return new Promise((resolve, reject) => {
       const img = new Image();
       img.onload = function() {
         const canvasElmnt = document.createElement('canvas');
         canvasElmnt.width = (this as HTMLImageElement).width;
         canvasElmnt.height = (this as HTMLImageElement).height;
         console.log(canvasElmnt);
         const ctx = canvasElmnt.getContext('2d');
         ctx.drawImage((this as HTMLImageElement), 0, 0);
         resolve(canvasElmnt);
       };
       img.src = URL.createObjectURL(image);
     });
   }

   async convertImageToJpg(image): Promise<string> {
     const canvas = await this.convertImageToCanvas(image);
     return canvas.toDataURL('image/jpeg');
   }*/

  /*jpgFromBase64(dataurl: string): Promise<File> {
    return new Promise((resolve, reject) => {
      const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new File([u8arr], 'temp.jpeg', {type: mime});
      resolve(file);
    });
  }

  public compressImage(image: { file: any, url: string }): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (image.file) {
        console.log(image.file.type);
        if (image.file.type === 'image/png') {
          image.file = await this.jpgFromBase64((await this.convertImageToJpg(image.file)));
        }

        try {
          console.info('Compressing image');
          console.info('size before: ' + image.file.size);
          this.pica.compressImage(image.file, .5).subscribe(async (result) => {
            console.info('size after: ' + result.size);
            resolve(await this.readImageUrl(result));
          }, (err) => {
            console.error(err);
            resolve(image.url);
          });
        } catch (err) {
          reject(err);
        }
      } else {
        resolve('');
      }
    });
  }*/

  /* public readImageUrl(img: any): Promise<string> {
     return new Promise((resolve, reject) => {
       const reader: any = new FileReader();
       reader.addEventListener('load', () => {
         resolve(reader.result);
       }, false);
       reader.addEventListener('error', (err) => {
         reject(err);
       });
       reader.readAsDataURL(img);
     });
   }
*/
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
