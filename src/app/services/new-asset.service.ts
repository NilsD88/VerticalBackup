import { SensorType } from './../models/sensor.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ILocation } from '../models/g-location.model';
import { throwError } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { IAsset, IPagedAssets } from '../models/g-asset.model';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  tap,
  map
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewAssetService {
  public assetUrl = 'fakeapi/assets'; // URL to web api
  public locationUrl = 'fakeapi/locations'; // URL to web api

  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
  private perfop = {
    headers: this.headers
  };
  private httpOptions = {
    headers: this.headers
  };

  private handleError(error: any) {
    console.error(error);
    return throwError(error);
  }

  constructor(
    public http: HttpClient,
    private apollo: Apollo,
  ) {}


  // START APOLLO

  public createAsset(asset: IAsset): Observable < boolean > {
    const CREATE_ASSET = gql `
            mutation CreateLocation($input: AssetCreateInput!) {
                createAsset(input: $input)
            }
        `;

    interface CreateAssetResponse {
      createAsset: boolean;
    }

    return this.apollo.mutate < CreateAssetResponse > ({
      mutation: CREATE_ASSET,
      variables: {
        input: {
          name: asset.name,
          locationId: asset.location.id,
          description: asset.description,
          geolocation: asset.geolocation,
          image: asset.image,
          thresholdTemplateId: (asset.thresholdTemplate) ? asset.thresholdTemplate.id : null,
          thingIds: asset.things.map((thing) => thing.id)
        }
      }
    }).pipe(
      map(({
        data
      }) => data.createAsset)
    );
  }

  public getAssets(): Observable < IAsset[] > {
    // TODO: add location when backend will be updated
    const GET_ASSETS = gql `
            query findAllAssets {
                assets: findAllAssets {
                    id,
                    name,
                    description,
                    #location {
                    #  id,
                    #  name
                    #}
                    thresholdTemplate {
                        id,
                        name
                    }
                }
            }
        `;

    interface GetAssetsResponse {
      assets: IAsset[];
    }

    return this.apollo.query < GetAssetsResponse > ({
      query: GET_ASSETS,
      fetchPolicy: 'network-only'
    }).pipe(map(({
      data
    }) => {
      return data.assets;
    }));
  }

  public getPagedAssets(pageNumber: number = 0, pageSize: number = 10): Observable < IPagedAssets > {
    const GET_PAGED_ASSETS = gql `
      query findAllAssetsPaged($input: PagedAssetInput!) {
        findAllAssetsPaged(input: $input) {
          totalElements,
          totalPages,
          assets {
              id,
              name,
              description,
              #location {
              #  id,
              #  name
              #}
              thresholdTemplate {
                  id,
                  name
              }
          }
        }
      }`;

    interface GetPagedAssetsResponse {
      findAllAssetsPaged: IPagedAssets;
    }

    return this.apollo.query < GetPagedAssetsResponse > ({
      query: GET_PAGED_ASSETS,
      variables: {
        input: {
          pageNumber,
          pageSize,
        }
      },
      fetchPolicy: 'network-only'
    }).pipe(map(({
      data
    }) => {
      return data.findAllAssetsPaged;
    }));

  }

  public getAssetById(id: string): Observable < IAsset > {

    // TODO: updated when backend ready
    const GET_ASSET_BY_ID = gql `
            query findAssetById($id: Long!) {
                asset: findAssetById(id: $id) {
                    id,
                    name,
                    description,
                    #location {
                    #    id,
                    #    name
                    #}
                }
            }
        `;

    interface GetAssetByIdResponse {
      asset: IAsset;
    }

    return this.apollo.query < GetAssetByIdResponse > ({
      query: GET_ASSET_BY_ID,
      fetchPolicy: 'network-only',
      variables: {
        id,
      }
    }).pipe(map(({
      data
    }) => data.asset));
  }

  public getAssetsByLocationId(locationId: string): Observable < IAsset[] > {
    const GET_ASSETS_BY_LOCATION_ID = gql `
      query FindAssetsByLocation($locationId: Long!) {
        assets: findAssetsByLocation(locationId: $locationId) {
            id,
            name,
            description,
            #location {
            #    id,
            #    name
            #}
            image,
            geolocation {
                lat
                lng
            }
        }
      }
    `;

    interface GetAssetsByLocationIdResponse {
      assets: IAsset[];
    }

    return this.apollo.query < GetAssetsByLocationIdResponse > ({
      query: GET_ASSETS_BY_LOCATION_ID,
      fetchPolicy: 'network-only',
      variables: {
        locationId,
      }
    }).pipe(map(({
      data
    }) => data.assets));
  }

  public getAssets_TankMonitoring_Dashboard(): Observable < IAsset[] > {
    const GET_ASSETS_BY_MODULE = gql `
      query FindAssetsByModule($input: AssetFindByModuleInput!) {
        assets: findAssetsByModule(input: $input) {
          id,
          name,
          things {
            batteryPercentage,
            sensors {
              sensorType {
                id,
                name
              }
              value,
              timestamp
            }
          }
        }
      }
    `;

    interface GetAssetsTankMonitoringDashboardResponse {
      assets: IAsset[];
    }

    return this.apollo.query < GetAssetsTankMonitoringDashboardResponse > ({
      query: GET_ASSETS_BY_MODULE,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          // moduleId: // TODO: module id
          // onlyThingsOrSensorsNeeded: // TODO: to be able to get only interesting data based on sensortype of the module (chart definition)
        }
      }
    }).pipe(map(({
      data
    }) => data.assets));

  }

  public updateAsset(asset: IAsset): Observable < IAsset > {

    const UPDATE_ASSET = gql `
      mutation UpdateAsset($input: AssetUpdateInput!)
    `;

    interface UpdateAssetResponse {
      asset: IAsset;
    }

    console.log(`[UPDATE] ASSET:`);
    console.log(asset);

    return this.apollo.mutate < UpdateAssetResponse > ({
      mutation: UPDATE_ASSET,
      variables: {
        input: {
          ...{
            asset
          }
        }
      }
    }).pipe(
      map(({
        data
      }) => data.asset)
    );
  }

  public deleteAsset(id: string): Observable < boolean > {
    const DELETE_ASSET = gql `
        mutation deleteAsset($input: AssetDeleteInput!) {
            deleteAsset(input: $input)
        }
    `;

    interface DeleteAssetsResponse {
        deleteAsset: boolean;
    }

    return this.apollo.mutate < DeleteAssetsResponse > ({
      mutation: DELETE_ASSET,
      variables: {
        input: {
            id,
        }
      }
    }).pipe(map(({
      data
    }) => data.deleteAsset));
  }


  // END APOLLO

  /*
  getAssets(filter: any = null): Promise < IAsset[] > {
    return new Promise(async (resolve, reject) => {
      let request = this.assetUrl;
      if (filter) {
        if (filter.name) {
          request += `?name=${filter.name}`;
        }
      }
      this.http.get < IAsset[] > (request).subscribe(
        async (assets: IAsset[]) => {
          console.log(assets);
          const locations = [];
          await Promise.all(assets.map(async (asset) => {
            const location = await this.http.get < ILocation[] > (`${this.locationUrl}/${asset.locationId}`).toPromise();
            locations.push(location);
          }));

          assets.forEach((asset: IAsset, index: number) => {
            asset.location = locations[index];
          });
          resolve(assets);
        }
      );
    });
  }
  */

  /*
  getPagedAssets(filter: any = null): Promise < IPagedAssets > {
    return new Promise(async (resolve, reject) => {
      const assets = await this.getAssets(filter);
      resolve({
        data: assets,
        pageNumber: 0,
        totalElements: assets.length
      });
    });
  }
  */

  /*
  getAssetById(id: string): Observable < IAsset > {
    return this.http.get < IAsset > (`${this.assetUrl}/${id}`);
  }
  */

  /*
  getAssetsByLocationId(id: number, filter: any = null): Observable < IAsset[] > {
    console.log('getAssetsByLocationId', id);
    if (filter) {
      console.log(filter);
      return this.http.get < IAsset[] > (`${this.assetUrl}/?locationId=${id}`);
    } else {
      return this.http.get < IAsset[] > (`${this.assetUrl}/?locationId=${id}`);
    }
  }
  */

  /*
  searchPagedAssetsWithFilter(filters: Observable < any > ) {
    return filters.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(filter => {
        return this.getPagedAssets(filter);
      })
    );
  }
  */

  /*

  searchAssetsWithFilter(filters: Observable < any > ) {
    return filters.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(filter => {
        return this.getAssets(filter);
      })
    );
  }
  */

  /*
  updateAsset(asset: IAsset) {
    return this.http.put(`${this.assetUrl}/${asset.id}`, asset, this.httpOptions);
  }
  */

  /*
  createAsset(asset: IAsset) {
    return this.http.post < ILocation > (`${this.assetUrl}`, asset, this.httpOptions).pipe(
      tap(data => console.log(data)),
      catchError(this.handleError)
    );
  }
  */

  /*
  deleteAsset(assetId: number) {
    return this.http.delete(`${this.assetUrl}/${assetId}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  */
}
