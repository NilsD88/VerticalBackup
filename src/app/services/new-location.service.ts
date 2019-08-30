import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { INewLocation } from '../models/new-location';

@Injectable({
    providedIn: 'root'
})
export class NewLocationService {
    public locationsUrl = 'fakeapi/locations';  // URL to web api
    public locationsFlatUrl = 'fakeapi/locationsFlat';  // URL to web api

    constructor(public http: HttpClient) { }

    getLocations(): Observable<INewLocation[]> {
        this.http.post('commands/resetdb', undefined);
        return this.http.get<INewLocation[]>(this.locationsUrl);
    }

    getLocationById(id: number): Observable<INewLocation> {
        return this.http.get<INewLocation>(`${this.locationsFlatUrl}/${id}`);
    }
}
