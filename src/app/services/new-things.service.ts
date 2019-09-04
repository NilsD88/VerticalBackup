import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IThing, Thing } from 'src/app/models/thing.model';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NewThingsService {
    public thingsUrl = 'fakeapi/things';

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
