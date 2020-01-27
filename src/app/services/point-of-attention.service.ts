import {
  HttpClient
} from '@angular/common/http';
import {
  IPointOfAttention,
  IPointOfAttentionItem
} from './../models/point-of-attention.model';
import {
  Injectable
} from '@angular/core';
import {
  Apollo
} from 'apollo-angular';
import gql from 'graphql-tag';
import {
  Observable
} from 'rxjs';
import {
  MOCK_POINTS_OF_ATTENTION
} from '../mocks/point-of-attention';
import {
  map
} from 'rxjs/operators';
import {
  environment
} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PointOfAttentionService {

  constructor(
    private apollo: Apollo,
    private http: HttpClient
  ) {}


  public getPointsOfAttention(): Observable < IPointOfAttention[] > {
    const GET_POINTS_OF_ATTENTION = gql `
          query findAllAssetGroups {
            assetGroups: findAllAssetGroups {
              id,
              name,
              location {
                id,
                name
              }
            }
          }
      `;

    interface GetPointsOfAttentionResponse {
      assetGroups: IPointOfAttention[] | null;
    }

    return this.apollo.query < GetPointsOfAttentionResponse > ({
      query: GET_POINTS_OF_ATTENTION,
      fetchPolicy: 'network-only'
    }).pipe(map(({
      data
    }) => {
      return data.assetGroups;
    }));
  }

  public getPointOfAttentionById(id: string): Observable < IPointOfAttention > {
    const GET_POINT_OF_ATTENTION_BY_ID = gql `
            query findAssetGroupById($id: Long!) {
              assetGroup: findAssetGroupById(id: $id) {
                id,
                name,
                description,
                location {
                  id,
                  name
                },
                items {
                  id,
                  name,
                  sensorType {
                    id,
                    name
                  },
                  aggregationType,
                  assets {
                    id,
                    name
                  }
                }
              }
            }
        `;

    interface GetPointOfAttentionByIdResponse {
      assetGroup: IPointOfAttention;
    }

    return this.apollo.query < GetPointOfAttentionByIdResponse > ({
      query: GET_POINT_OF_ATTENTION_BY_ID,
      fetchPolicy: 'network-only',
      variables: {
        id,
      }
    }).pipe(map(({
      data
    }) => data.assetGroup));
  }

  public getPointOfAttentionByLocationId(locationId: string): Observable < IPointOfAttention[] > {
    const GET_POINTS_OF_ATTENTION_BY_LOCATION_ID = gql `
          query findAssetGroupsByLocation($input: AssetGroupFindByLocationInput!) {
            assetGroups: findAssetGroupsByLocation(input: $input) {
              id,
              name,
            }
          }
      `;

    interface GetPointsOfAttentionByIdResponse {
      assetGroups: IPointOfAttention[] | null;
    }

    return this.apollo.query < GetPointsOfAttentionByIdResponse > ({
      query: GET_POINTS_OF_ATTENTION_BY_LOCATION_ID,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          locationId
        }
      }
    }).pipe(map(({
      data
    }) => {
      return data.assetGroups;
    }));
  }

  public createPointOfAttention(pointOfAttention: IPointOfAttention): Observable < boolean > {
    const CREATE_POINT_OF_ATTENTION = gql `
        mutation createAssetGroup($input: AssetGroupCreateInput!) {
          createAssetGroup(input: $input)
        }
    `;

    interface CreatePointOfAttentionResponse {
      createAssetGroup: boolean;
    }

    return this.apollo.mutate < CreatePointOfAttentionResponse > ({
      mutation: CREATE_POINT_OF_ATTENTION,
      variables: {
        input: {
          name: pointOfAttention.name,
          locationId: pointOfAttention.location.id,
          description: pointOfAttention.description,
          items: pointOfAttention.items.map(item => {
            return {
              name: item.name,
              sensorTypeId: item.sensorType.id,
              aggregationType: item.aggregationType,
              assetIds: item.assets.map(asset => asset.id)
            };
          })
        }
      }
    }).pipe(
      map(({
        data
      }) => data.createAssetGroup)
    );
  }

  public deletePointOfAttention(id: string): Observable < boolean > {
    const DELETE_POINT_OF_ATTENTION = gql `
        mutation deleteAssetGroup($input: AssetGroupDeleteInput!) {
          deleteAssetGroup(input: $input)
        }
    `;

    interface DeletePointOfAttentionResponse {
      deleteAssetGroup: boolean;
    }

    return this.apollo.mutate < DeletePointOfAttentionResponse > ({
      mutation: DELETE_POINT_OF_ATTENTION,
      variables: {
        input: {
          id,
        }
      }
    }).pipe(map(({
      data
    }) => data.deleteAssetGroup));
  }

  public updatePointOfAttention(pointOfAttention: IPointOfAttention): Observable < boolean > {
    const UPDATE_POINT_OF_ATTENTION = gql `
        mutation updateAssetGroup($input: AssetGroupUpdateInput!) {
          updateAssetGroup(input: $input)
        }
    `;

    interface UpdatePointOfAttentionResponse {
      updateAssetGroup: boolean;
    }

    return this.apollo.mutate < UpdatePointOfAttentionResponse > ({
      mutation: UPDATE_POINT_OF_ATTENTION,
      variables: {
        input: {
          ...pointOfAttention
        }
      }
    }).pipe(map(({
      data
    }) => data.updateAssetGroup));
  }

  public getPointOfAttentionDetailById(id: string): Observable < IPointOfAttention > {
    return this.getPointOfAttentionById(id);
  }

  public getPointOfAttentionDataById(id: string, interval: string, from: number, to: number): Observable < IPointOfAttention > {
    return this.http.get < IPointOfAttention > (`${environment.baseUrl}/assetGroup/${id}/data?interval=${interval}&from=${from}&to=${to}`);
  }

  public createPointOfAttentionItem(pointOfAttentionItem: IPointOfAttentionItem, pointOfAttentionId: string): Observable < boolean > {
    const CREATE_POINT_OF_ATTENTION_ITEM = gql `
        mutation createAssetGroupItem($input: AssetGroupItemCreateInput!) {
          createAssetGroupItem(input: $input)
        }
    `;

    interface CreatePointOfAttentionItemResponse {
      createAssetGroupItem: boolean;
    }

    return this.apollo.mutate < CreatePointOfAttentionItemResponse > ({
      mutation: CREATE_POINT_OF_ATTENTION_ITEM,
      variables: {
        input: {
          name: pointOfAttentionItem.name,
          sensorTypeId: pointOfAttentionItem.sensorType.id,
          aggregationType: pointOfAttentionItem.aggregationType,
          assetGroupId: pointOfAttentionId,
          assetIds: pointOfAttentionItem.assets.map(asset => asset.id),
        }
      }
    }).pipe(
      map(({
        data
      }) => data.createAssetGroupItem)
    );
  }

  public deletePointOfAttentionItem(id: string): Observable < boolean > {
    const DELETE_POINT_OF_ATTENTION = gql `
        mutation deleteAssetGroup($input: AssetGroupDeleteInput!) {
          deleteAssetGroup(input: $input)
        }
    `;

    interface DeletePointOfAttentionResponse {
      deleteAssetGroup: boolean;
    }

    return this.apollo.mutate < DeletePointOfAttentionResponse > ({
      mutation: DELETE_POINT_OF_ATTENTION,
      variables: {
        input: {
          id,
        }
      }
    }).pipe(map(({
      data
    }) => data.deleteAssetGroup));
  }

  public updatePointOfAttentionItem(pointOfAttentionItem: IPointOfAttentionItem): Observable < boolean > {

    const UPDATE_POINT_OF_ATTENTION_ITEM = gql `
        mutation updateAssetGroupItem($input: AssetGroupItemUpdateInput!) {
          updateAssetGroupItem(input: $input)
        }
    `;

    interface UpdatePointOfAttentionResponse {
      updateAssetGroupItem: boolean;
    }

    return this.apollo.mutate < UpdatePointOfAttentionResponse > ({
      mutation: UPDATE_POINT_OF_ATTENTION_ITEM,
      variables: {
        input: {
          ...pointOfAttentionItem
        }
      }
    }).pipe(map(({
      data
    }) => data.updateAssetGroupItem));
  }


  



}
