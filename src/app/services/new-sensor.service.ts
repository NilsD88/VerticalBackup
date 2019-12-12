import { ISensorDefinition } from './../models/g-sensor-definition.model';
import { ISensorType } from 'src/app/models/g-sensor-type.model';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
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
                    name,
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

    public getSensorTypes(): Observable<ISensorType[]> {
        const GET_SENSOR_TYPE_NAMES = gql`
            query findAllSensorTypes {
                sensorTypes: findAllSensorTypes {
                    id,
                    name,
                    type,
                    min,
                    max,
                    postfix
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

    public getSensorTypesByModule(moduleName: string): Observable<ISensorType[]> {
        const GET_SENSOR_TYPES_BY_MODULE = gql`
            query findAllSensorTypesByModule($input: String) {
                sensorTypes: findAllSensorTypesByModule(input: $input) {
                    id,
                    name,
                }
            }
        `;

        interface GetSensorTypeNamesResponse {
            sensorTypes: ISensorType[];
        }

        return this.apollo.query<GetSensorTypeNamesResponse>({
            query: GET_SENSOR_TYPES_BY_MODULE,
            fetchPolicy: 'network-only',
            variables: {
                input: moduleName
            }
        }).pipe(map(({data}) => {
            return data.sensorTypes;
        }));
    }


    public updateSensorDefinition(sensorId: string, sensorDefinition: ISensorDefinition): Observable<boolean> {
        const UPDATE_SENSOR_DEFINITION = gql `
              mutation updateSensorDefinition($input: SensorDefinitionUpdateInput!) {
                updated: updateSensorDefinition(input: $input)
              }
          `;

        interface UpdateSensorDefinition {
          updated: boolean;
        }

        return this.apollo.mutate < UpdateSensorDefinition > ({
          mutation: UPDATE_SENSOR_DEFINITION,
          variables: {
            input: {
              sensorId,
              sensorDefinition,
            }
          }
        }).pipe(
          map(({
            data
          }) => data.updated)
        );
    }



}
