import {Injectable} from '@angular/core';
import {Asset, IAsset, IPagedAssets} from '../models/asset.model';
import {SharedService} from './shared.service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {isNullOrUndefined} from 'util';
import {environment} from '../../environments/environment';

export interface IAssetFilter {
  name?: string;
  thresholdTemplates?: string[];
  locationType?: string;
  locations?: string[];
  sublocations?: string[];
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(public sharedService: SharedService, private http: HttpClient, private snackBar: MatSnackBar) {
  }

  public getAssetById(id: string | number): Promise<Asset> {
    return new Promise(async (resolve, reject) => {
      this.http.get(`${this.sharedService.baseUrl}assets/${id}`)
        .subscribe((response: IAsset) => {
          resolve(new Asset(response));
        }, (err) => {
          const snackBarRef = this.snackBar.open(
            'Error! Failed to fetch asset data. Please reload.',
            null, {
              duration: 3000,
              panelClass: 'error-snackbar'
            });
          console.error('AssetService: ' + err.message);
          reject(err);
        });
    });
  }

  public getAssets(filter?: IAssetFilter): Promise<Asset[]> {
    let query = '';
    if (!isNullOrUndefined(filter)) {
      let nameQuery = null;
      let statusQuery = null;
      let thresholdTemplateQuery = null;
      let locationTypeQuery = null;
      let locationsQuery = null;
      let sublocationsQuery = null;

      if(filter.name) {
        nameQuery = filter.name.length ? `name=="*${filter.name.toLowerCase()}*"` : null;
      }
     
      if(filter.status) {
        statusQuery = filter.status.length ? `status=="${filter.status}"` : null;
        if (filter.status.length === 1) {
          statusQuery = `alerts=statusOk=${filter.status[0].toLowerCase() === 'ok'}`;
        }
      }

      if(filter.thresholdTemplates) {
        thresholdTemplateQuery = filter.thresholdTemplates.length ?
        `thresholdTemplate.id=in=(${filter.thresholdTemplates.toString()})`
        : null;
      }

      if(filter.locationType) {
        locationTypeQuery = !isNullOrUndefined(filter.locationType) ?
        `sublocation.location.locationType.id==${filter.locationType}`
        : null;
      }

    
      if(filter.locations) {
        locationsQuery = filter.locations.length ?
        `sublocation.location.id=in=(${filter.locations.toString()})` :
        null;
      }

      if(filter.sublocations) {
        locationsQuery = null;
        sublocationsQuery = filter.locations.length ?
        `sublocation.id=in=(${filter.locations.toString()})` :
        null;
      }
      

      query = this.sharedService.buildFilterQuery([
      nameQuery,statusQuery,
      thresholdTemplateQuery,
      locationTypeQuery,
      locationsQuery,
      sublocationsQuery,
      statusQuery]);
    }

    const url = `${environment.baseUrl}assets/${query ? query : ''}`;

    return new Promise(async (resolve, reject) => {
      this.http.get(url)
        .subscribe((response: any) => {
          resolve(Asset.createArray(response.content));
        }, (err) => {
          const snackBarRef = this.snackBar.open(
            'Error! Failed to fetch assets. Please reload.',
            null, {
              duration: 3000,
              panelClass: 'error-snackbar'
            });
          console.error('AssetService: ' + err.message);
          reject(err);
        });
    });
  }

  public getPagedAssets(filter: IAssetFilter, pageIndex: number, pageSize: number, sort: string = null, order:string = "asc"): Promise<IPagedAssets> {
    let query;
    if (!isNullOrUndefined(filter)) {
      console.log("Filter not null");
      const nameQuery = filter.name.length ? `name=="*${filter.name.toLowerCase()}*"` : undefined;
      const thresholdTemplateQuery = filter.thresholdTemplates.length ?
        `thresholdTemplate.id=in=(${filter.thresholdTemplates.toString()})`
        : undefined;

      const locationTypeQuery = !isNullOrUndefined(filter.locationType) ?
        `sublocation.location.locationType.id==${filter.locationType}`
        : undefined;

      let locationsQuery;
      if(filter.locations && filter.locations.length > 0) {
        locationsQuery = filter.locations.length ?
        `sublocation.location.id=in=(${filter.locations.toString()})` :
        null;
      }

      let sublocationsQuery;
      if(filter.sublocations && filter.sublocations.length > 0) {
        locationsQuery = null;
        sublocationsQuery = filter.sublocations.length ?
        `sublocation.id=in=(${filter.sublocations.toString()})` :
        null;
      }

     

      query = this.sharedService.buildFilterQuery([nameQuery, thresholdTemplateQuery, locationTypeQuery, locationsQuery, sublocationsQuery]);
      console.log("query", query);
    }

    let sortQuery = '';
    if(!isNullOrUndefined(sort)) {
      sortQuery = `&${sort},${order}`;
    }

    const url = `${environment.baseUrl}assets/${query ? query : ''}${query ? '&' : '?'}page=${pageIndex}&size=${pageSize}${sortQuery}`;

    return new Promise(async (resolve, reject) => {
      this.http.get(url)
        .subscribe((response: any) => {
          response = Asset.createPagedArray(response);
          resolve(response);
        }, (err) => {
          const snackBarRef = this.snackBar.open(
            'Error! Failed to fetch assets. Please reload.',
            null, {
              duration: 3000,
              panelClass: 'error-snackbar'
            });
          console.error('AssetService: ' + err.message);
          reject(err);
        });
    });
  }

  public deleteAsset(id: string | number) {
    return new Promise(async (resolve, reject) => {
      this.http.delete(`${environment.baseUrl}assets/${id}`)
        .subscribe((response: IAsset) => {
          const snackBarRef = this.snackBar.open(
            'Successfully deleted artwork.',
            null, {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          resolve(new Asset(response));
        }, (err) => {
          const snackBarRef = this.snackBar.open(
            'Error! Failed to delete asset. Please retry.',
            null, {
              duration: 3000,
              panelClass: 'error-snackbar'
            });
          console.error('AssetService: ' + err.message);
          reject(err);
        });
    });
  }
}
