import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { INewAsset, IPagedNewAssets } from '../models/new-asset.model';
import { INewLocation } from '../models/new-location';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

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

    constructor(public http: HttpClient) { }

    getAssets(filter: any = null): Promise<INewAsset[]> {
        return new Promise(async (resolve, reject) => {
            let request = this.assetUrl;
            if (filter) {
                if (filter.name) {
                    request += `?name=${filter.name}`;
                }
            }
            this.http.get<INewAsset[]>(request).subscribe(
                async (assets: INewAsset[]) => {
                    console.log(assets);
                    const locations = [];
                    await Promise.all(assets.map(async (asset) => {
                        const location = await this.http.get<INewLocation[]>(`${this.locationUrl}/${asset.locationId}`).toPromise();
                        locations.push(location);
                    }));

                    assets.forEach((asset: INewAsset, index: number) => {
                        asset.location = locations[index];
                    });
                    resolve(assets);
                }
            );
        });
    }

    getPagedAssets(filter: any = null): Promise<IPagedNewAssets> {
        return new Promise(async (resolve, reject) => {
            const assets = await this.getAssets(filter);
            resolve ({
                data: assets,
                pageNumber: 0,
                totalElements: assets.length
            });
        });
    }

    getAssetById(id: number): Observable<INewAsset> {
        return this.http.get<INewAsset>(`${this.assetUrl}/${id}`);
    }

    getAssetsByLocationId(id: number): Observable<INewAsset[]> {
        console.log('getAssetsByLocationId', id);
        return this.http.get<INewAsset[]>(`${this.assetUrl}/?locationId=${id}`);
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

    updateAsset(asset: INewAsset) {
        return this.http.put(`${this.assetUrl}/${asset.id}`, asset, this.httpOptions);
    }

    createAsset(asset: INewAsset) {
        return this.http.post<INewLocation>(`${this.assetUrl}`, asset, this.httpOptions).pipe(
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
