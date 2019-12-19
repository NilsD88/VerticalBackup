import { IThing } from 'src/app/models/g-thing.model';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
    providedIn: 'root'
})
export class NewThingService {

    constructor(
        private apollo: Apollo,
    ) { }


     // START APOLLO

    public getThings(): Observable<IThing[]> {
        const GET_THINGS = gql`
            query findAllThings {
                things: findAllThings {
                    id,
                    devEui,
                    name,
                    sensors {
                        id,
                        sensorType {
                            id,
                            name,
                            postfix,
                            type,
                            min,
                            max
                        },
                        sensorDefinition {
                            id,
                            name,
                            useOnChart,
                            chartType,
                            useOnNotification,
                            inOutType,
                            aggregatedValues {
                                min,
                                max,
                                sum,
                                avg
                            }
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

    public getThingsByAssetId(assetId: string): Observable<IThing[]> {
        const GET_THINGS_BY_ASSET_ID = gql`
            query findAllThingsByAsset($locationId: Long!) {
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

    public getThingById(id: string): Observable<IThing> {
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

    public updateThing(thing: IThing): Observable<boolean> {
        const UPDATE_THING = gql`
            mutation updateThing($input: ThingUpdateInput!) {
                updateThing(input: $input)
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
    /*

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
    */

}
