import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {SharedService} from './shared.service';
import {IPagedThresholdTemplates, IThresholdTemplate, ThresholdTemplate} from '../models/threshold.model';
import {environment} from '../../environments/environment';
import {IAssetFilter} from './asset.service';
import {isNullOrUndefined} from 'util';

@Injectable({
  providedIn: 'root'
})
export class ThresholdTemplateService {

  constructor(public http: HttpClient, public snackBar: MatSnackBar, public sharedService: SharedService) {
  }

  public getThresholdTemplates(): Promise<ThresholdTemplate[]> {
    return new Promise(async (resolve, reject) => {
      this.http.get(`${environment.baseUrl}thresholdtemplates/`)
        .subscribe((response: any) => {
          console.log(response);
          resolve(ThresholdTemplate.createArray(response.content));
        }, (err: HttpErrorResponse) => {
          this.sharedService.rejectPromise('Error! Failed to fetch materials. Please reload.', reject);
        });
    });
  }

  public getPagedThresholdTemplates(filter, pageIndex: number, pageSize: number): Promise<IPagedThresholdTemplates> {
    let query;
    if (!isNullOrUndefined(filter)) {
      const nameQuery = filter.name.length ? `name=="*${filter.name.toLowerCase()}*"` : undefined;
      query = this.sharedService.buildFilterQuery([nameQuery]);
    }

    const url = `${environment.baseUrl}thresholdtemplates/${query ? query : ''}${query ? '&' : '?'}page=${pageIndex}&size=${pageSize}`;

    return new Promise(async (resolve, reject) => {
      this.http.get(url)
        .subscribe((response: any) => {
          resolve(ThresholdTemplate.createPagedArray(response.content));
        }, (err: HttpErrorResponse) => {
          this.sharedService.rejectPromise('Error! Failed to fetch materials. Please reload.', reject);
        });
    });
  }

  public getThresholdTemplate(id: string | number): Promise<ThresholdTemplate> {
    return new Promise(async (resolve, reject) => {
      this.http.get(`${environment.baseUrl}thresholdtemplates/${id}`)
        .subscribe((response: any) => {
          resolve(new ThresholdTemplate(response));
        }, (err: HttpErrorResponse) => {
          this.sharedService.rejectPromise('Error! Failed to fetch material. Please try again.', reject);
        });
    });
  }

  public deleteThresholdTemplate(id: string | number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.http.delete(`${environment.baseUrl}thresholdtemplates/${id}`)
        .subscribe((response: any) => {
          const snackBarRef = this.snackBar.open(
            'Successfully deleted material.',
            null, {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          resolve(response);
        }, (err: HttpErrorResponse) => {
          this.sharedService.rejectPromise('Error! Failed to delete material. Please try again.', reject);
        });
    });
  }

  public createThresholdTemplate(thresholdTemplate: ThresholdTemplate): Promise<ThresholdTemplate> {
    return new Promise(async (resolve, reject) => {
      this.http.post(`${environment.baseUrl}thresholdtemplates/`, thresholdTemplate)
        .subscribe((response: IThresholdTemplate) => {
          const snackBarRef = this.snackBar.open(
            'Successfully created material.',
            null, {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          resolve(new ThresholdTemplate(response));
        }, (err: HttpErrorResponse) => {
          const snackBarRef = this.snackBar.open(
            'Error! Failed to create material. Please try again.',
            null, {
              duration: 3000,
              panelClass: 'error-snackbar'
            });
          console.error('ThresholdTemplateService: ' + err.message);
          reject(err);
        });
    });
  }

  public updateThresholdTemplate(thresholdTemplate: ThresholdTemplate): Promise<ThresholdTemplate> {
    return new Promise(async (resolve, reject) => {
      this.http.put(`${environment.baseUrl}thresholdtemplates/${thresholdTemplate.id}`, thresholdTemplate)
        .subscribe((response: any) => {
          const snackBarRef = this.snackBar.open(
            'Successfully updated material.',
            null, {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          resolve(new ThresholdTemplate(response));
        }, () => {
          this.sharedService.rejectPromise('Error! Failed to update material. Please try again.', reject);
        });
    });
  }
}
