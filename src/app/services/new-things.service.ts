import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IThing, Thing } from 'src/app/models/thing.model';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NewThingsService {
    public thingsUrl = 'fakeapi/things';

    private headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
    private perfop = { headers: this.headers };
    private httpOptions = { headers: this.headers };

    private handleError(error: any) {
        console.error(error);
        return throwError(error);
    }


    constructor(public http: HttpClient) { }

    getThings(): Promise<Thing[]> {
        return new Promise(async (resolve, reject) => {
            return this.http.get<IThing[]>(this.thingsUrl)
                .subscribe((response: any) => {
                    resolve(Thing.createArray(response));
                }, () => {
                    reject(console.error('Error! Failed to fetch things. Please reload.'));
                });
        });
    }

    getThingsByName(name: string): Promise<Thing[]> {
        return new Promise(async (resolve, reject) => {
            return this.http.get<IThing[]>(`${this.thingsUrl}/?name=${name}`)
                .subscribe((response: any) => {
                    resolve(Thing.createArray(response));
                }, () => {
                    reject(console.error('Error! Failed to fetch things. Please reload.'));
                });
        });
    }

    getThingsByDevEui(devEui: string): Promise<Thing[]> {
        return new Promise(async (resolve, reject) => {
            return this.http.get<IThing[]>(`${this.thingsUrl}/?devEui=${devEui}`)
                .subscribe((response: any) => {
                    resolve(Thing.createArray(response));
                }, () => {
                    reject(console.error('Error! Failed to fetch things. Please reload.'));
                });
        });
    }

    updateThing(thing: IThing) {
        return this.http.put(`${this.thingsUrl}/${thing.id}`, thing, this.httpOptions);
    }

    public searchTerm(terms: Observable<string>) {
        return terms.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(term => {
                const thingsMatchWithName = this.getThingsByName(term);
                const thingsMatchWithDevEui = this.getThingsByDevEui(term);
                return Promise.all([thingsMatchWithName, thingsMatchWithDevEui]);
            })
        );
    }

}
