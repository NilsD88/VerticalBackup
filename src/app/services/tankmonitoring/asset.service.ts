import { NewAssetService } from 'src/app/services/new-asset.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ITankMonitoringAsset } from 'src/app/models/tankmonitoring/asset.model';
import { map, timestamp } from 'rxjs/operators';
import { IThing } from 'src/app/models/g-thing.model';
import { HttpClient } from '@angular/common/http';
import { IPagedAssets } from 'src/app/models/g-asset.model';


const MODULE_NAME = 'TANK_MONITORING';

@Injectable({
  providedIn: 'root'
})
export class TankMonitoringAssetService extends NewAssetService {

  constructor(
    public apollo: Apollo,
    public http: HttpClient,
  ) {
    super(
      apollo,
      http
    );
  }

  public createAsset(asset: ITankMonitoringAsset): Observable < boolean > {
    asset.module = MODULE_NAME;
    return super.createAsset(asset);
  }

  public getAssets(): Observable < ITankMonitoringAsset[] > {
    // Real data
    const GET_ASSETS_BY_MODULE = gql `
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

    interface GetAssetsTankMonitoringDashboardResponse {
      assets: ITankMonitoringAsset[];
    }

    return this.apollo.query < GetAssetsTankMonitoringDashboardResponse > ({
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

  public getPagedAssets(pageNumber: number = 0, pageSize: number = 10, filter = {}): Observable < IPagedAssets > {
    return super.getPagedAssets(
      pageNumber,
      pageSize,
      filter,
      MODULE_NAME
    );
  }

  public getAssetPopupDetail(id: string): Observable < ITankMonitoringAsset > {
    const GET_ASSET_POPUP_DETAIL_BY_ID = gql `
            query findAssetById($id: Long!) {
                asset: findAssetById(id: $id) {
                    id,
                    name,
                    description,
                    image,
                    lastRefill {
                      timestamp
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

  public getAssetDetailById(id: string): Observable < ITankMonitoringAsset > {

    const GET_ASSET_DETAIL_BY_ID = gql `
            query findAssetById($id: Long!) {
                asset: findAssetById(id: $id) {
                    id,
                    name,
                    description,
                    lastRefill {
                      timestamp
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
                      image
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
      asset: ITankMonitoringAsset;
    }

    return this.apollo.query < GetAssetDetailByIdResponse > ({
      query: GET_ASSET_DETAIL_BY_ID,
      fetchPolicy: 'network-only',
      variables: {
        id,
      }
    }).pipe(map(({
      data
    }) => data.asset));
  }

  public getAssetDataById(id: string, interval: string, from: number, to: number): Observable < IThing[] > {
    return super.getAssetDataById(
      id,
      interval,
      from,
      to,
      MODULE_NAME
    );
  }

}
