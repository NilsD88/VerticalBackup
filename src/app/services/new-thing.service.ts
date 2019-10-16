import { IThing } from 'src/app/models/g-thing.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
    providedIn: 'root'
})
export class NewThingService {
    public thingsUrl = 'fakeapi/things';

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

    public a_getThings(): Observable<IThing[]> {
        const GET_THINGS = gql`
            things: query findAllThings {
                things: findAllThings {
                    id,
                    name,
                    sensors {
                        sensorType {
                            id,
                            name
                        }
                    }
                }
            }
        `;

        interface GetThingsQuery {
            things: IThing[];
        }

        return this.apollo.query<GetThingsQuery>({
            query: GET_THINGS,
            fetchPolicy: 'network-only'
        }).pipe(map(({data}) => {
            return data.things;
        }));
    }

    public a_getThingsByAssetId(assetId: string): Observable<IThing[]> {
        const GET_THINGS_BY_ASSET_ID = gql`
            things: query findAllThingsByAsset($locationId: Long!) {
                things: findAllThingsByAsset(locationId: $locationId) {
                    id,
                    name,
                    sensors {
                        sensorType {
                            id,
                            name
                        }
                    }
                }
            }
        `;

        interface GetThingsByAssetIdResponse {
            things: IThing[];
        }

        return this.apollo.query<GetThingsByAssetIdResponse>({
            query: GET_THINGS_BY_ASSET_ID,
            fetchPolicy: 'network-only'
        }).pipe(map(({data}) => {
            return data.things;
        }));
    }

    public a_getThingById(id: string): Observable<IThing> {
        const GET_THING_BY_ID = gql`
            query findThingById($input: ThingByIdInput!) {
                thing: findThingById(input: $input) {
                    id,
                    name,
                }
            }
        `;

        interface GetThingByIdQuery {
            thing: IThing | null;
        }

        return this.apollo.query<GetThingByIdQuery>({
            query: GET_THING_BY_ID,
            fetchPolicy: 'network-only',
            variables: {
                input: {
                    id
                }
            }
        }).pipe(map(({data}) => data.thing));
    }

    public a_updateThing(thing: IThing): Observable<boolean> {
        const UPDATE_THING = gql`
            mutation updateThing($input: ThingInput!) {
                thresholdTemplate: updateThing(id: $id) {
                    id,
                    name,
                }
            }
        `;

        interface UpdateThingQuery {
            updateThing: boolean;
        }

        return this.apollo.mutate<UpdateThingQuery>({
            mutation: UPDATE_THING,
            variables: {
                input: {
                    id: thing.id,
                    name: thing.name
                }
            }
        }).pipe(map(({data}) => data.updateThing));
    }


    // END APOLLO

    getThings(): Promise<IThing[]> {
        return new Promise(async (resolve, reject) => {
            return this.http.get<IThing[]>(this.thingsUrl)
                .subscribe((things: IThing[]) => {
                    resolve(things);
                }, () => {
                    reject(console.error('Error! Failed to fetch things. Please reload.'));
                });
        });
    }

    getThingsByName(name: string): Promise<IThing[]> {
        return new Promise(async (resolve, reject) => {
            return this.http.get<IThing[]>(`${this.thingsUrl}/?name=${name}`)
                .subscribe((things: IThing[]) => {
                    resolve(things);
                }, () => {
                    reject(console.error('Error! Failed to fetch things. Please reload.'));
                });
        });
    }

    getThingsByDevEui(devEui: string): Promise<IThing[]> {
        return new Promise(async (resolve, reject) => {
            return this.http.get<IThing[]>(`${this.thingsUrl}/?devEui=${devEui}`)
                .subscribe((things: IThing[]) => {
                    resolve(things);
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
