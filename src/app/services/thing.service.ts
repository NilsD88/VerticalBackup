import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {Thing} from '../models/thing.model';
import {SharedService} from './shared.service';
import {environment} from 'src/environments/environment';
import { IThing } from '../models/g-thing.model';

@Injectable({
  providedIn: 'root'
})
export class ThingService {


  constructor(public http: HttpClient, public sharedService: SharedService, public snackBar: MatSnackBar) {
  }

  public getAll(): Promise<Thing[]> {
    return new Promise(async (resolve, reject) => {
      this.http.get(`${environment.baseUrl}things/`)
        .subscribe((response: any) => {
          resolve(Thing.createArray(response.content));
        }, () => {
          this.sharedService.rejectPromise('Error! Failed to fetch devices. Please reload.', reject);
        });
    });
  }

  public getByFilter(filter): Promise<Thing[]> {
    const uidQuery = filter.devEui.length ? `devEui=="*${filter.devEui}*"` : undefined;

    const query = this.sharedService.buildFilterQuery([uidQuery]);
    const url = `${this.sharedService.baseUrl}things/${query}`;

    return new Promise(async (resolve, reject) => {
      this.http.get(url)
        .subscribe((response: any) => {
          resolve(Thing.createArray(response.content));
        }, () => {
          this.sharedService.rejectPromise('Error! Failed to fetch devices. Please reload.', reject);
        });
    });
  }

  public updateName(device: IThing) {
    return new Promise(async (resolve, reject) => {
      this.http.patch(`${environment.baseUrl}things/${device.id}`, {name: device.name})
        .subscribe((thing: IThing) => {
          const snackBarRef = this.snackBar.open(
            'Successfully updated device name.',
            null, {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          resolve(thing);
        }, () => {
          this.sharedService.rejectPromise('Error! Failed to update device name. Please reload.', reject);
        });
    });
  }
}
