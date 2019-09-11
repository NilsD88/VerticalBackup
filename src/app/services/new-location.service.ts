import { INewLocation } from 'src/app/models/new-location';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NewLocationService {
    public locationsUrl = 'fakeapi/locations';  // URL to web api

    private headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
    private perfop = { headers: this.headers };
    private httpOptions = { headers: this.headers };

    private handleError(error: any) {
        console.error(error);
        return throwError(error);
    }

    constructor(public http: HttpClient) { }


    getLocationsFlat(): Observable<INewLocation[]> {
        return this.http.get<INewLocation[]>(`${this.locationsUrl}`);
    }

    async getLocationsTree(): Promise<INewLocation[]> {
        console.log('----- getLocationsTree -----');
        const result = await this.getSublocations(null);
        console.log('----- finish ---- ');
        return result;
    }

    getLocationById(id: number): Observable<INewLocation> {
        return this.http.get<INewLocation>(`${this.locationsUrl}/${id}`);
    }

    updateLocation(location: INewLocation) {
        return this.http.put(`${this.locationsUrl}/${location.id}`, location, this.httpOptions);
    }

    createLocation(location: INewLocation) {
        console.log('want create this location:');
        console.log({...location});
        return this.http.post<INewLocation>(`${this.locationsUrl}`, location, this.httpOptions).pipe(
            tap(data => console.log(data)),
            catchError(this.handleError)
        );
    }

    deleteLocation(locationId: number) {
        console.log('will remove', locationId);
        return this.http.delete(`${this.locationsUrl}/${locationId}`, this.httpOptions).pipe(
            catchError(this.handleError)
        );
    }

    private async getSublocations(id: number) {
        const roots = await this.http.get<INewLocation[]>(`${this.locationsUrl}/?parentId=${id}`).toPromise();
        const sublocationsArray = [];

        await Promise.all(roots.map(async (location) => {
            const sublocations = await this.getSublocations(+location.id);
            sublocationsArray.push(sublocations);
        }));

        roots.forEach((location: INewLocation, index: number) => {
            location.sublocations = sublocationsArray[index];
        });

        return roots;
    }
}
