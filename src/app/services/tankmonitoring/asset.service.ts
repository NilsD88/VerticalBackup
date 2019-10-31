import { MOCK_NEW_CHART_TANK_DATA } from 'src/app/mocks/chart';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ITankMonitoringAsset } from 'src/app/models/tankmonitoring/asset.model';
import { map } from 'rxjs/operators';
import { IThing } from 'src/app/models/g-thing.model';

@Injectable({
  providedIn: 'root'
})
export class TankMonitoringAssetService {

  constructor(
    private apollo: Apollo,
  ) {}

  public getAssets(): Observable < ITankMonitoringAsset[] > {

    return new Observable < ITankMonitoringAsset[] > ((observer) => {
      observer.next([{
          id: '0',
          name: 'test',
          location: {
            id: '102',
            name: '2tc'
          },
          things: [{
            devEui: 'OKAZEAZEAZ',
            batteryPercentage: 15,
            sensors: [{
              sensorType: {
                id: '1',
                name: 'sensorTypeName'
              },
              value: 9,
              timestamp: new Date().getTime()
            }]
          }],
          geolocation: {
            lat: 1,
            lng: 1
          }
        },
        {
          id: '1',
          name: 'test 2',
          location: {
            id: '0',
            name: 'location 2'
          },
          things: [{
            devEui: '12321312312',
            batteryPercentage: 82,
            sensors: [{
              sensorType: {
                id: '1',
                name: 'sensorTypeName'
              },
              value: 33,
              timestamp: new Date().getTime()
            }]
          }],
          geolocation: {
            lat: 1.2,
            lng: 1.2
          }
        }
      ]);
      observer.complete();
    });

    const GET_ASSETS_BY_MODULE = gql `
        query FindAssetsByModule($input: AssetFindByModuleInput!) {
          assets: findAssetsByModule(input: $input) {
            id,
            name,
            things {
              devEui,
              batteryPercentage,
              sensors {
                sensorType {
                  id,
                  name
                }
                value,
                timestamp
              }
            }
          }
        }
      `;

    interface GetAssetsTankMonitoringDashboardResponse {
      assets: ITankMonitoringAsset[];
    }

    return this.apollo.query < GetAssetsTankMonitoringDashboardResponse > ({
      query: GET_ASSETS_BY_MODULE,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          // moduleId: // TODO: module id
          // onlySensorsNeeded: // TODO: to be able to get only interesting data based on sensortype of the module (chart definition)
        }
      }
    }).pipe(map(({
      data
    }) => data.assets));

  }

  public getAssetPopupDetail(id: string): Observable < ITankMonitoringAsset > {
    const GET_ASSET_POPUP_DETAIL_BY_ID = gql `
        query findAssetById($id: Long!) {
          asset: findAssetById(id: $id) {
              id,
              name,
              description,
              image
          }
        }
      `;

    interface GetAssetDetailByIdResponse {
      asset: ITankMonitoringAsset;
    }

    return this.apollo.query < GetAssetDetailByIdResponse > ({
      query: GET_ASSET_POPUP_DETAIL_BY_ID,
      fetchPolicy: 'network-only',
      variables: {
        id,
      }
    }).pipe(map(({
      data
    }) => data.asset));
  }

  public getAssetDataById(id: string, interval: string, from: number, to: number): Observable < IThing[] > {
    return Observable.create((observer) => {
      observer.next(MOCK_NEW_CHART_TANK_DATA);
      observer.complete();
    });
  }

}
