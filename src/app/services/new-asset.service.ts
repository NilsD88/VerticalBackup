import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ILocation } from '../models/g-location.model';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { IAsset, IPagedAssets } from '../models/g-asset.model';

@Injectable({
    providedIn: 'root'
})
export class NewAssetService {
    public assetUrl = 'fakeapi/assets';  // URL to web api
    public locationUrl = 'fakeapi/locations';  // URL to web api

    private headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
    private perfop = { headers: this.headers };
    private httpOptions = { headers: this.headers };

    private handleError(error: any) {
        console.error(error);
        return throwError(error);
    }

    constructor(
        public http: HttpClient,
        private apollo: Apollo,
    ) { }


    // START APOLLO

    public a_createAsset(asset: IAsset): Observable<IAsset> {
        const CREATE_ASSET = gql`
            mutation CreateLocation($asset: AssetInput!) {
                asset: createAsset(asset: $asset) {
                    id,
                    name,
                }
            }
        `;

        interface CreateAssetResponse {
            asset: IAsset;
        }

        return this.apollo.mutate<CreateAssetResponse>({
            mutation: CREATE_ASSET,
            variables: {
                asset: {
                    name: asset.name,
                    description: asset.description,
                    location: asset.location,
                    geolocation: asset.geolocation,
                    //TODO: ASK FOR IMAGE WHAT/HOW TO SEND
                    image: {
                        data: asset.image,
                    },
                    things: asset.things,
                    thresholdTemplate: asset.thresholdTemplate
                }
            }
        }).pipe(
            tap(data => {
                console.log(data);
            }),
            map(({data}) => data.asset)
        );
    }

    public a_getAssets(): Observable<IAsset[]> {
        const GET_ASSETS = gql`
            query findAllAssets {
                assets: findAllAssets {
                    id,
                    name,
                    description,
                    location: {
                        id,
                        name
                    }
                }
            }
        `;

        interface GetAssetsQuery {
            assets: IAsset[];
        }

        return this.apollo.watchQuery<GetAssetsQuery>({
            query: GET_ASSETS
        }).valueChanges.pipe(map(({data}) => {
            return data.assets;
        }));
    }

    public a_getAssetById(id: number): Observable<IAsset> {
        const GET_ASSET_BY_ID = gql`
            query findAssetById($id: Long!) {
                location: findAssetById(id: $id) {
                    id,
                    name,
                    description,
                    location: {
                        id,
                        name
                    }
                }
            }
        `;

        interface GetAssetByIdQuery {
            asset: IAsset;
        }

        return this.apollo.watchQuery<GetAssetByIdQuery>({
            query: GET_ASSET_BY_ID,
            variables: {
                id,
            }
        }).valueChanges.pipe(map(({data}) => data.asset));
    }

    public a_updateAsset(asset: IAsset): Observable<IAsset> {

        const UPDATE_ASSET = gql`
            mutation UpdateAsset($input: AssetUpdateInput!) {
                asset: updateAsset(input: $input) {
                    id,
                    name,
                }
            }
        `;

        interface UpdateAssetResponse {
            asset: IAsset;
        }


        console.log(`[UPDATE] ASSET:`);
        console.log(asset);

        return this.apollo.mutate<UpdateAssetResponse>({
            mutation: UPDATE_ASSET,
            variables: {
                input: {
                    ...{asset}
                }
            }
        }).pipe(
            map(({data}) => data.asset)
        );
    }

    a_getAssetsByLocationId(id: number): Observable<IAsset[]> {
        const GET_ASSETS_BY_LOCATION_ID = gql`
            query FindAssetsByLocation($id: Long!) {
                assets: findAssetsByLocation(id: $id) {
                    id,
                    name,
                    description,
                    location {
                        id,
                        name
                    }
                    image,
                    geolocation {
                        lat
                        lng
                    }
                }
            }
        `;

        interface GetAssetsByLocationIdQuery {
            assets: IAsset[];
        }

        return this.apollo.watchQuery<GetAssetsByLocationIdQuery>({
            query: GET_ASSETS_BY_LOCATION_ID,
            variables: {
                id,
            }
        }).valueChanges.pipe(map(({data}) => data.assets));
    }


    // END APOLLO

    getAssets(filter: any = null): Promise<IAsset[]> {
        return new Promise(async (resolve, reject) => {
            let request = this.assetUrl;
            if (filter) {
                if (filter.name) {
                    request += `?name=${filter.name}`;
                }
            }
            this.http.get<IAsset[]>(request).subscribe(
                async (assets: IAsset[]) => {
                    console.log(assets);
                    const locations = [];
                    await Promise.all(assets.map(async (asset) => {
                        const location = await this.http.get<ILocation[]>(`${this.locationUrl}/${asset.locationId}`).toPromise();
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

    getPagedAssets(filter: any = null): Promise<IPagedAssets> {
        return new Promise(async (resolve, reject) => {
            const assets = await this.getAssets(filter);
            resolve ({
                data: assets,
                pageNumber: 0,
                totalElements: assets.length
            });
        });
    }

    getAssetById(id: number): Observable<IAsset> {
        return this.http.get<IAsset>(`${this.assetUrl}/${id}`);
    }

    getAssetsByLocationId(id: number, filter: any = null): Observable<IAsset[]> {
        console.log('getAssetsByLocationId', id);
        if (filter) {
            console.log(filter);
            return this.http.get<IAsset[]>(`${this.assetUrl}/?locationId=${id}`);
        } else {
            return this.http.get<IAsset[]>(`${this.assetUrl}/?locationId=${id}`);
        }
    }

    searchPagedAssetsWithFilter(filters: Observable<any>) {
      return filters.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(filter => {
          return this.getPagedAssets(filter);
        })
      );
    }

    searchAssetsWithFilter(filters: Observable<any>) {
        return filters.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(filter => {
            return this.getAssets(filter);
            })
        );
    }

    updateAsset(asset: IAsset) {
        return this.http.put(`${this.assetUrl}/${asset.id}`, asset, this.httpOptions);
    }

    createAsset(asset: IAsset) {
        return this.http.post<ILocation>(`${this.assetUrl}`, asset, this.httpOptions).pipe(
            tap(data => console.log(data)),
            catchError(this.handleError)
        );
    }

    deleteAsset(assetId: number) {
        return this.http.delete(`${this.assetUrl}/${assetId}`, this.httpOptions).pipe(
            catchError(this.handleError)
        );
    }
}
