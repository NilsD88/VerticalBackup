import { ISensorType } from 'src/app/models/g-sensor-type.model';
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
export class NewSensorService {

    constructor(
        private apollo: Apollo,
    ) { }


     // START APOLLO

    public getSensorTypeNames(): Observable<ISensorType[]> {
        const GET_SENSOR_TYPE_NAMES = gql`
            query findAllSensorTypes {
                sensorTypes: findAllSensorTypes {
                    id,
                    name
                }
            }
        `;

        interface GetSensorTypeNamesResponse {
            sensorTypes: ISensorType[];
        }

        return this.apollo.query<GetSensorTypeNamesResponse>({
            query: GET_SENSOR_TYPE_NAMES,
            fetchPolicy: 'network-only'
        }).pipe(map(({data}) => {
            return data.sensorTypes;
        }));
    }


}
