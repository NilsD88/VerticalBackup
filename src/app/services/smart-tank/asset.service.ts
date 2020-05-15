import {AssetService} from 'src/app/services/asset.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {ISmartTankAsset} from 'src/app/models/smart-tank/asset.model';
import {map} from 'rxjs/operators';
import {IThing} from 'src/app/models/thing.model';
import {HttpClient} from '@angular/common/http';
import {IPagedAssets} from 'src/app/models/asset.model';


const MODULE_NAME = 'TANK_MONITORING';

@Injectable({
  providedIn: 'root'
})
export class SmartTankAssetService extends AssetService {

  constructor(
    public apollo: Apollo,
    public http: HttpClient,
  ) {
    super(
      apollo,
      http
    );
  }

  public createAsset(asset: ISmartTankAsset): Observable<boolean> {
    asset.module = MODULE_NAME;
    return super.createAsset(asset);
  }

  public getAssets(): Observable<ISmartTankAsset[]> {
      // Real data
      const GET_ASSETS_BY_MODULE = gql`
          query FindAssetsByModule($input: AssetFindByModuleInput!) {
              assets: findAssetsByModule(input: $input) {
                  id,
                  name,
                  location {
                      id,
                      name,
                  },
                  geolocation {
                      lat,
                      lng
                  }
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

    interface GetAssetsSmartTankDashboardResponse {
      assets: ISmartTankAsset[];
    }

    return this.apollo.query <GetAssetsSmartTankDashboardResponse>({
      query: GET_ASSETS_BY_MODULE,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          moduleName: MODULE_NAME
        }
      }
    }).pipe(map(({
                   data
                 }) => data.assets));

  }

  public getPagedAssets(pageNumber: number = 0, pageSize: number = 10, filter = {}): Observable<IPagedAssets> {
    return super.getPagedAssets(
      pageNumber,
      pageSize,
      filter,
      MODULE_NAME
    );
  }

  public getAssetPopupDetail(id: string): Observable<ISmartTankAsset> {
      const GET_ASSET_POPUP_DETAIL_BY_ID = gql`
          query findAssetById($id: Long!) {
              asset: findAssetById(id: $id) {
                  id,
                  name,
                  description,
                  image,
                  lastRefill {
                      timestamp,
                      value
                  },
                  location {
                      name,
                  },
                  things {
                      devEui,
                      batteryPercentage,
                      sensors {
                          value
                      }
                  }
              }
          }
      `;

    interface GetAssetDetailByIdResponse {
      asset: ISmartTankAsset;
    }

    return this.apollo.query <GetAssetDetailByIdResponse>({
      query: GET_ASSET_POPUP_DETAIL_BY_ID,
      fetchPolicy: 'network-only',
      variables: {
        id,
      }
    }).pipe(map(({
                   data
                 }) => data.asset));
  }

  public getAssetDetailById(id: string): Observable<ISmartTankAsset> {

      const GET_ASSET_DETAIL_BY_ID = gql`
          query findAssetById($id: Long!) {
              asset: findAssetById(id: $id) {
                  id,
                  name,
                  description,
                  overwriteGPS,
                  lastRefill {
                      timestamp,
                      value
                  },
                  geolocation {
                      lat,
                      lng
                  },
                  location {
                      id,
                      name,
                      geolocation {
                          lat,
                          lng
                      },
                      image,
                      customFields {
                        keyId,
                        value
                      }
                  },
                  customFields {
                      keyId,
                      value
                  }
                  things {
                      id,
                      name,
                      devEui,
                      batteryPercentage,
                      sensors {
                          id,
                          sensorType {
                              id,
                              name,
                              postfix
                          },
                          timestamp,
                          value,
                          sensorDefinition {
                              name,
                              useOnChart,
                              chartType,
                              aggregatedValues {
                                  min,
                                  max,
                                  avg,
                                  sum
                              }
                          }
                      }
                  },
                  thresholdTemplate {
                      id,
                      name,
                      thresholds {
                          sensorType {
                              id,
                              name,
                              postfix,
                              min,
                              max,
                              type
                          },
                          thresholdItems {
                              id,
                              range {
                                  from,
                                  to
                              },
                              severity,
                          }
                      }
                  },
                  image
              }
          }
      `;

    interface GetAssetDetailByIdResponse {
      asset: ISmartTankAsset;
    }

    return this.apollo.query <GetAssetDetailByIdResponse>({
      query: GET_ASSET_DETAIL_BY_ID,
      fetchPolicy: 'network-only',
      variables: {
        id,
      }
    }).pipe(map(({
                   data
                 }) => data.asset));
  }

  public getAssetsByLocationId(locationId: string): Observable<ISmartTankAsset[]> {
    return super.getAssetsByLocationId(
      locationId,
      MODULE_NAME
    );
  }

  public getAssetDataById(id: string, interval: string, from: number, to: number): Observable<IThing[]> {
    return super.getAssetDataById(
      id,
      interval,
      from,
      to,
      MODULE_NAME
    );
  }

}
