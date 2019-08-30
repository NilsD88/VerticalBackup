import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { INewAsset } from '../models/new-asset.model';

@Injectable({
    providedIn: 'root'
})
export class NewAssetService {
    public assetUrl = 'fakeapi/assets';  // URL to web api
    constructor(public http: HttpClient) { }

    getAssets(): Observable<INewAsset[]> {
        return this.http.get<INewAsset[]>(this.assetUrl);
    }

    getAssetsByLocationId(id: number): Observable<INewAsset[]> {
        return this.http.get<INewAsset[]>(`${this.assetUrl}/?locationId=${id}`);
    }
}
