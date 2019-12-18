import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import {
  Apollo
} from 'apollo-angular';
import gql from 'graphql-tag';
import {
  IAsset,
  IPagedAssets
} from '../models/g-asset.model';
import {
  map
} from 'rxjs/operators';
import { IThing } from '../models/g-thing.model';
import { Observable } from 'rxjs';
import { IField } from '../models/field.model';
import { MOCK_ASSETS_CUSTOM_FIELDS } from '../mocks/newasset';
import { MOCK_NEW_CHART_TANK_DATA } from '../mocks/chart';

@Injectable({
  providedIn: 'root'
})
export class NewAssetService {

  constructor(
    public apollo: Apollo,
    public http: HttpClient,
  ) {}

  public createAsset(asset: IAsset): Observable < boolean > {
    const CREATE_ASSET = gql `
            mutation CreateLocation($input: AssetCreateInput!) {
                createAsset(input: $input)
            }
        `;

    interface CreateAssetResponse {
      createAsset: boolean;
    }

    return this.apollo.mutate < CreateAssetResponse > ({
      mutation: CREATE_ASSET,
      variables: {
        input: {
          name: asset.name,
          locationId: asset.location.id,
          description: asset.description,
          geolocation: asset.geolocation,
          image: asset.image,
          thresholdTemplateId: (asset.thresholdTemplate) ? asset.thresholdTemplate.id : null,
          thingIds: asset.things.map((thing) => thing.id),
          customFields: asset.customFields,
          module: asset.module || 'SMART_MONITORING'
        }
      }
    }).pipe(
      map(({
        data
      }) => data.createAsset)
    );
  }

  public getAssets(): Observable < IAsset[] > {
    const GET_ASSETS = gql `
      query findAllAssets {
        assets: findAllAssets {
          id,
          name,
          description,
          location {
            id,
            name
          },
          thresholdTemplate {
              id,
              name
          },
          module
        }
      }
    `;

    interface GetAssetsResponse {
      assets: IAsset[];
    }

    return this.apollo.query < GetAssetsResponse > ({
      query: GET_ASSETS,
      fetchPolicy: 'network-only'
    }).pipe(map(({
      data
    }) => {
      return data.assets;
    }));
  }

  public getAssetById(id: string): Observable < IAsset > {
    console.log('getAssetById SM');
    const GET_ASSET_BY_ID = gql `
            query findAssetById($id: Long!) {
                asset: findAssetById(id: $id) {
                    id,
                    name,
                    description,
                    module,
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
                    things {
                     id,
                     name,
                     sensors {
                       sensorType {
                         id,
                         name
                       }
                     }
                    },
                    thresholdTemplate {
                      id,
                      name
                    },
                    image,
                    customFields {
                      keyId,
                      value
                    }
                }
            }
        `;

    interface GetAssetByIdResponse {
      asset: IAsset;
    }

    return this.apollo.query < GetAssetByIdResponse > ({
      query: GET_ASSET_BY_ID,
      fetchPolicy: 'network-only',
      variables: {
        id,
      }
    }).pipe(map(({
      data
    }) => data.asset));
  }

  public getAssetDetailById(id: string): Observable < IAsset > {

    const GET_ASSET_DETAIL_BY_ID = gql `
            query findAssetById($id: Long!) {
                asset: findAssetById(id: $id) {
                    id,
                    name,
                    description,
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
      asset: IAsset;
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

  public getAssetDataById(id: string, interval: string, from: number, to: number, moduleName: string = null): Observable < IThing[] > {
    let url = `${environment.baseUrl}/asset/${id}/data?interval=${interval}&from=${from}&to=${to}`;
    if (moduleName) {
      url += `&module=${moduleName}`;
    }
    return this.http.get < IThing [] > (url);
  }

  public getAssetsByLocationId(locationId: string, moduleName: string = null): Observable < IAsset[] > {
    const GET_ASSETS_BY_LOCATION_ID = gql `
      query FindAssetsByLocation($input: AssetFindByLocationInput!) {
        assets: findAssetsByLocation(input: $input) {
            id,
            name,
            description,
            location {
              id,
              name
            },
            geolocation {
                lat,
                lng
            }
        }
      }
    `;

    interface GetAssetsByLocationIdResponse {
      assets: IAsset[];
    }

    return this.apollo.query < GetAssetsByLocationIdResponse > ({
      query: GET_ASSETS_BY_LOCATION_ID,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          locationId,
          moduleName
        }
      }
    }).pipe(map(({
      data
    }) => data.assets));
  }

  public getAssetsByName(name: string): Observable < IAsset[] > {
    const GET_ASSETS_BY_NAME = gql `
      query findAssetsByName($input: AssetFindByNameInput!) {
        assets: findAssetsByName(input: $input) {
            id,
            name,
        }
      }
    `;

    interface GetAssetsByNameResponse {
      assets: IAsset[];
    }

    return this.apollo.query < GetAssetsByNameResponse > ({
      query: GET_ASSETS_BY_NAME,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          // TODO remove orgid
          organizationId: 1,
          name: name || ''
        }
      }
    }).pipe(map(({
      data
    }) => data.assets));
  }

  public getAssetPopupDetail(id: string): Observable < IAsset > {
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
      asset: IAsset;
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

  public getPagedAssets(pageNumber: number = 0, pageSize: number = 10, filter = {}, moduleName: string = null): Observable < IPagedAssets > {
    const GET_PAGED_ASSETS = gql `
      query findAssetsByFilterPaged($input: PagedAssetFindByFilterInput!) {
        pagedAssets: findAssetsByFilterPaged(input: $input) {
          totalElements,
          totalPages,
          assets {
              id,
              name,
              description,
              location {
                id,
                name
              }
              thresholdTemplate {
                  id,
                  name
              }
          }
        }
      }`;

    interface GetPagedAssetsResponse {
      pagedAssets: IPagedAssets;
    }

    return this.apollo.query < GetPagedAssetsResponse > ({
      query: GET_PAGED_ASSETS,
      variables: {
        input: {
          organizationId: 1,
          pageNumber,
          pageSize,
          ...filter,
          module: moduleName
        }
      },
      fetchPolicy: 'network-only'
    }).pipe(map(({
      data
    }) => {
      return data.pagedAssets;
    }));

  }

  public getImageOfAssetById(id: string): Observable < string > {
    const GET_IMAGE_OF_ASSET_BY_ID = gql `
            query findAssetById($id: Long!) {
                asset: findAssetById(id: $id) {
                    image
                }
            }
        `;

    interface GetImageAssetByIdResponse {
      asset: IAsset;
    }

    return this.apollo.query < GetImageAssetByIdResponse > ({
      query: GET_IMAGE_OF_ASSET_BY_ID,
      fetchPolicy: 'network-only',
      variables: {
        id,
      }
    }).pipe(map(({
      data
    }) => data.asset.image));
  }

  public updateAsset(asset: IAsset): Observable < boolean > {

    const UPDATE_ASSET = gql `
      mutation UpdateAsset($input: AssetUpdateInput!) {
        response: updateAsset(input: $input)
      }
    `;

    interface UpdateAssetResponse {
      response: boolean;
    }

    return this.apollo.mutate < UpdateAssetResponse > ({
      mutation: UPDATE_ASSET,
      variables: {
        input: {
          ...asset
        }
      }
    }).pipe(
      map(({
        data
      }) => data.response)
    );
  }

  public deleteAsset(id: string): Observable < boolean > {
    const DELETE_ASSET = gql `
        mutation deleteAsset($input: AssetDeleteInput!) {
            deleteAsset(input: $input)
        }
    `;

    interface DeleteAssetsResponse {
      deleteAsset: boolean;
    }

    return this.apollo.mutate < DeleteAssetsResponse > ({
      mutation: DELETE_ASSET,
      variables: {
        input: {
          id,
        }
      }
    }).pipe(map(({
      data
    }) => data.deleteAsset));
  }

  public getCustomFields(): Observable < IField [] > {
    const GET_CUSTOM_FIELDS = gql `
      query findFields($organizationId: Long!, $subjectType: String!) {
          fields: getKeysByOrganizationAndSubjectType(organizationId: $organizationId, subjectType: $subjectType) {
            id,
            label {
              fr,
              en,
              nl
            }
            type,
            options
          }
      }
    `;

    interface GetCustomFieldsResponse {
      fields: IField[];
    }

    return this.apollo.query < GetCustomFieldsResponse > ({
      query: GET_CUSTOM_FIELDS,
      fetchPolicy: 'network-only',
      variables: {
        organizationId: 1,
        subjectType: 'ASSET'
      }
    }).pipe(map(({
      data,
    }) => data.fields));
  }

}
