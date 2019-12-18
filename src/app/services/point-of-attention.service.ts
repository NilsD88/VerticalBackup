import { HttpClient } from '@angular/common/http';
import {
  IPointOfAttention, IPointOfAttentionItem
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
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PointOfAttentionService {

  constructor(
    private apollo: Apollo,
    private http: HttpClient
  ) {}

  public getPointsOfAttention(): Observable < IPointOfAttention[] > {
    return new Observable < IPointOfAttention[] > ((observer) => {
      observer.next(MOCK_POINTS_OF_ATTENTION);
      observer.complete();
    });
  }

  public getPointOfAttentionById(id: string): Observable < IPointOfAttention > {
    return new Observable < IPointOfAttention > ((observer) => {
      observer.next(MOCK_POINTS_OF_ATTENTION.find(pointOfAttention => pointOfAttention.id === id));
      observer.complete();
    });
  }

  public getPointOfAttentionByLocationId(locationId: string): Observable < IPointOfAttention[] > {
    return new Observable < IPointOfAttention[] > ((observer) => {
      observer.next(
        MOCK_POINTS_OF_ATTENTION.filter(pointOfAttention => pointOfAttention.location.id === locationId)
      );
      observer.complete();
    });
  }

  public deletePointOfAttention(id: string): Observable < boolean > {
    const DELETE_POINT_OF_ATTENTION = gql `
        mutation deletePointOfAttention($input: PointOfAttentionDeleteInput!) {
          deletePointOfAttention(input: $input)
        }
    `;

    interface DeletePointOfAttentionResponse {
      deletePointOfAttention: boolean;
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
    }) => data.deletePointOfAttention));
  }

  public updatePointOfAttention(pointOfAttention: IPointOfAttention): Observable < boolean > {
    const UPDATE_POINT_OF_ATTENTION = gql `
        mutation updatePointOfAttention($input: PointOfAttentionUpdateInput!) {
          updatePointOfAttention(input: $input)
        }
    `;

    interface UpdatePointOfAttentionResponse {
      updatePointOfAttention: boolean;
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
    }) => data.updatePointOfAttention));
  }

  public getPointOfAttentionDetailById(id: string): Observable < IPointOfAttention > {

    return new Observable < IPointOfAttention > ((observer) => {
      observer.next(MOCK_POINTS_OF_ATTENTION.find(pointOfAttention => pointOfAttention.id === id));
      observer.complete();
    });

    const GET_POINT_OF_ATTENTION_DETAIL_BY_ID = gql `
            query findPointAttentionById($id: Long!) {
                pointOfAttention: findPointAttentionById(id: $id) {
                    id,
                    name,
                    description,
                    location {
                      id,
                      name,
                    },
                    items {
                      id,
                      name
                    }
                }
            }
        `;

    interface GetPointOfAttentionDetailByIdResponse {
      pointOfAttention: IPointOfAttention;
    }

    return this.apollo.query < GetPointOfAttentionDetailByIdResponse > ({
      query: GET_POINT_OF_ATTENTION_DETAIL_BY_ID,
      fetchPolicy: 'network-only',
      variables: {
        id,
      }
    }).pipe(map(({
      data
    }) => data.pointOfAttention));
  }


  public getPointOfAttentionDataById(id: string, interval: string, from: number, to: number): Observable < IPointOfAttentionItem[] > {
    return new Observable < IPointOfAttentionItem[] > ((observer) => {
      const pointOfAttention = MOCK_POINTS_OF_ATTENTION[0];
      pointOfAttention.items[0].series = [{
        timestamp: 1560819600000,
        value: 96.0,
      }, {
        timestamp: 1560837600000,
        value: 96.0,
      }, {
        timestamp: 1560859200000,
        value: 94.0,
      }, {
        timestamp: 1560880800000,
        value: 23.0,
      }, {
        timestamp: 1560902400000,
        value: 23.0,
      }, {
        timestamp: 1560924000000,
        value: 23.0,
      }, {
        timestamp: 1560949200000,
        value: 23.0,
      }, {
        timestamp: 1560967200000,
        value: 23.0,
      }];
      observer.next(pointOfAttention.items);
      observer.complete();
    });
    
    return this.http.get < IPointOfAttentionItem [] > (`${environment.baseUrl}/point-of-attention/${id}/data?interval=${interval}&from=${from}&to=${to}`);
  }



}
