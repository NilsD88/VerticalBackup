import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {Thing} from '../models/thing.model';
import {SharedService} from './shared.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThingService {


  constructor(public http: HttpClient, public sharedService: SharedService, public snackBar: MatSnackBar) {
  }

  public getAll(filter?): Promise<Thing[]> {
    return new Promise(async (resolve, reject) => {
      this.http.get(`${environment.baseUrl}things/`)
        .subscribe((response: any) => {
          resolve(Thing.createArray(response.content));
        }, () => {
          this.sharedService.rejectPromise('Error! Failed to fetch devices. Please reload.', reject);
        });
    });
  }

  public updateName(device: Thing) {
    return new Promise(async (resolve, reject) => {
      this.http.patch(`${environment.baseUrl}things/${device.id}`, {name: device.name})
        .subscribe((response: any) => {
          const snackBarRef = this.snackBar.open(
            'Successfully updated device name.',
            null, {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          resolve(new Thing(response));
        }, () => {
          this.sharedService.rejectPromise('Error! Failed to update device name. Please reload.', reject);
        });
    });
  }
}
