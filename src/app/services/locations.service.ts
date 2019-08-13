import {Injectable} from '@angular/core';


import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {isNullOrUndefined} from 'util';
import {SharedService} from './shared.service';
import {ILocation, Location, LocationType, Sublocation} from '../models/locations.model';
import {environment} from '../../environments/environment';
import {Asset} from '../models/asset.model';
import {Thing} from '../models/thing.model';
import {ThresholdTemplate} from '../models/threshold.model';

export interface ILocationsFilter {
  name: string;
  thresholdTemplates: ThresholdTemplate[];
  status: string[];
  sublocation?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  constructor(public http: HttpClient, public snackBar: MatSnackBar, public sharedService: SharedService) {
  }

  public getLocations(locationTypeId?: string | number): Promise<Location[]> {
    const url = `${environment.baseUrl}locations${!isNullOrUndefined(locationTypeId) ? '?filter=locationType.id==' + locationTypeId : '/'}`;
    return new Promise(async (resolve, reject) => {
      this.http.get(url)
        .subscribe((response: any) => {
          resolve(Location.createArray(response.content));
        }, (err: HttpErrorResponse) => {
          this.sharedService.rejectPromise('Error! Failed to fetch locations. Please try again.', reject);
        });
    });
  }

  public getSublocationsByLocationId(locationId?: string | number): Promise<Sublocation[]> {
    const url = `${environment.baseUrl}locations/${locationId}`;
    return new Promise(async (resolve, reject) => {
      this.http.get(url)
        .subscribe((response: any) => {
          resolve(Sublocation.createArray(response.sublocations));
        }, (err: HttpErrorResponse) => {
          this.sharedService.rejectPromise('Error! Failed to fetch sublocations. Please try again.', reject);
        });
    });
  }

  public getAssetsByLocationId(id: string | number, filter: ILocationsFilter): Promise<Asset[]> {
    const sublocationQuery = !isNullOrUndefined(id) ? `sublocation.id==${id}` : undefined;
    const nameQuery = filter.name.length ? `name=="*${filter.name}*"` : undefined;
    const thresholdTemplateQuery = filter.thresholdTemplates.length ?
      `thresholdTemplate.id=in=(${filter.thresholdTemplates.toString()})`
      : undefined;
    let statusQuery;
    if (filter.status.length) {
      if (filter.status.length === 1) {
        statusQuery = `alerts=statusOk=${filter.status[0].toLowerCase() === 'ok'}`;
      }
    }

    const query = this.sharedService.buildFilterQuery([sublocationQuery, nameQuery, thresholdTemplateQuery, statusQuery]);
    const url = `${this.sharedService.baseUrl}assets/${query}`;

    return new Promise(async (resolve, reject) => {
      this.http.get(url)
        .subscribe((response: any) => {
          resolve(Asset.createArray(response.content));
        }, (err: HttpErrorResponse) => {
          this.sharedService.rejectPromise('Error! Failed to fetch assets. Please try again.', reject);
        });
    });
  }

  public getDevicesByAssetId(id: string): Promise<Thing[]> {
    return new Promise(async (resolve, reject) => {

      this.http.get(`${environment.baseUrl}things?filter=asset.id==${id}/`)
        .subscribe((response: any) => {
          resolve(Thing.createArray(response.content));
        }, (err) => {
          this.sharedService.rejectPromise('Error! Failed to fetch location types. Please reload.', reject);
        });
    });
  }

  public getLocationTypes(): Promise<LocationType[]> {
    return new Promise(async (resolve, reject) => {
      this.http.get(`${environment.baseUrl}locationtypes/`)
        .subscribe((response: any) => {
          resolve(LocationType.createArray(response.content));
        }, (err) => {
          this.sharedService.rejectPromise('Error! Failed to fetch location types. Please reload.', reject);
        });
    });
  }

  // ADMIN ACTIONS

  public createLocation(location: Location): Promise<Location> {
    return new Promise(async (resolve, reject) => {
      this.http.post(`${environment.baseUrl}locations/`, location)
        .subscribe((response: any) => {
          const snackBarRef = this.snackBar.open(
            'Successfully created location.',
            null, {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          resolve(new Location(response));
        }, (err) => {
          this.sharedService.rejectPromise('Error! Failed to create location. Please try to submit again.', reject);
        });
    });
  }

  public createSublocation(parentLocationId: string | number, sublocation: Sublocation): Promise<void> {
    const assembled = new Sublocation(sublocation).assemble();
    return new Promise(async (resolve, reject) => {
      this.http.post(`${environment.baseUrl}sublocations/`, assembled)
        .subscribe((response: any) => {
          const snackBarRef = this.snackBar.open(
            'Successfully created sublocation.',
            null, {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          resolve();
        }, (err) => {
          this.sharedService.rejectPromise('Error! Failed to create sublocation. Please try to submit again.', reject);
        });
    });
  }

  public updateSublocation(parentLocationId: string | number, sublocation: Sublocation): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.http.put(`${environment.baseUrl}sublocations/${sublocation.id}`, new Sublocation(sublocation).assemble())
        .subscribe((response: any) => {
          const snackBarRef = this.snackBar.open(
            'Successfully updated sublocation.',
            null, {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          resolve();
        }, (err) => {
          this.sharedService.rejectPromise('Error! Failed to update sublocation. Please try to submit again.', reject);
        });
    });
  }

  public updateLocation(location: Location): Promise<Location> {

    return new Promise(async (resolve, reject) => {
      this.http.patch(`${environment.baseUrl}locations/${location.id}`, location)
        .subscribe((response: ILocation) => {
          const snackBarRef = this.snackBar.open(
            'Successfully updated location.',
            null, {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          resolve(new Location(response));
        }, (err) => {
          this.sharedService.rejectPromise('Error! Failed to create location. Please try to submit again.', reject);
        });
    });
  }

  public deleteLocation(id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.http.delete(`${environment.baseUrl}locations/${id}`)
        .subscribe((response: any) => {
          const snackBarRef = this.snackBar.open(
            'Successfully deleted location.',
            null, {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          resolve(response);
        }, (err) => {
          this.sharedService.rejectPromise('Error! Failed to delete location. Please try again.', reject);
        });
    });
  }

  public deleteLSublocation(id: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.http.delete(`${environment.baseUrl}sublocations/${id}`)
        .subscribe(() => {
          const snackBarRef = this.snackBar.open(
            'Successfully deleted sublocation.',
            null, {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          resolve();
        }, (err) => {
          this.sharedService.rejectPromise('Error! Failed to delete sublocation. Please try again.', reject);
        });
    });
  }

}
