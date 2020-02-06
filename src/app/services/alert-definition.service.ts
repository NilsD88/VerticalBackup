import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {SharedService} from './shared.service';
import {environment} from 'src/environments/environment';
import {AlertDefinition} from '../models/alert-definition.model';

@Injectable({
  providedIn: 'root'
})
export class AlertDefinitionService {

  constructor(public http: HttpClient, public sharedService: SharedService, public snackBar: MatSnackBar) {
  }

  public getDefaultAlertDefinition(): Promise<AlertDefinition> {
    return new Promise(async (resolve, reject) => {
      this.http.get(`${environment.baseUrl}/alertdefinitions/?filter=name=='Default'`)
        .subscribe((response: any) => {
          if (response) {
            const defaultAlertDef = response.length ? new AlertDefinition(response[0]) : new AlertDefinition(null);
            resolve(defaultAlertDef);
          } else {
            this.sharedService.rejectPromise('AlertDefinitionsService: Invalid server response', reject);
          }
        }, () => {
          this.sharedService.rejectPromise('AlertDefinitionsService: Invalid server response', reject);
        });
    });
  }

  public updateDefaultAlertDefinitionAssets(alertDefinition): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.http.put(`${environment.baseUrl}/alertdefinitions/${alertDefinition.id}`, {assets: alertDefinition.assets})
        .subscribe((response: any) => {
          const snackBarRef = this.snackBar.open(
            'Successfully updated alert definition assets settings.',
            null, {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          resolve(response);
        }, (err) => {
          this.sharedService.rejectPromise('Error! Failed to fetch alertDefinition data. Please reload.', reject);
        });
    });
  }

  public updateDefaultAlertDefinition(alertDefinition): Promise<any> {
    console.log(alertDefinition);
    return new Promise(async (resolve, reject) => {
      this.http.put(`${environment.baseUrl}/alertdefinitions/${alertDefinition.id}`, alertDefinition)
        .subscribe((response: any) => {
          const snackBarRef = this.snackBar.open(
            'Successfully updated alert definition settings.',
            null, {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          resolve(response);
        }, (err) => {
          this.sharedService.rejectPromise('Error! Failed to update alert definition settings.', reject);
        });
    });
  }

  public updateDefaultAlertDefinitionEmail(alertDefinition): Promise<any> {
    return new Promise(async (resolve, reject) => {
      console.log(alertDefinition);
      this.http.put(`${environment.baseUrl}/alertdefinitions/${alertDefinition.id}`, alertDefinition)
        .subscribe((response: any) => {
          const snackBarRef = this.snackBar.open(
            'Successfully updated alert definition settings.',
            null, {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          resolve(response);
        }, (err) => {
          this.sharedService.rejectPromise('Error! Failed to update alert definition settings.', reject);
        });
    });
  }
}
