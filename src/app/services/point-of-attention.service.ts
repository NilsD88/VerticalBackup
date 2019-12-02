import { IPointOfAttention } from './../models/point-of-attention.model';
import {
  Injectable
} from '@angular/core';
import {
  Apollo
} from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { MOCK_POINTS_OF_ATTENTION } from '../mocks/point-of-attention';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PointOfAttentionService {

  constructor(
    private apollo: Apollo,
  ) {}

  public getPointsOfAttention(): Observable < IPointOfAttention[] > {
    return new Observable < IPointOfAttention[] > ((observer) => {
      observer.next(MOCK_POINTS_OF_ATTENTION);
      observer.complete();
    });
  }

  public getPointOfAttentionById(id: string): Observable < IPointOfAttention> {
    return new Observable < IPointOfAttention > ((observer) => {
      observer.next(MOCK_POINTS_OF_ATTENTION.find(pointOfAttention => pointOfAttention.id === id));
      observer.complete();
    });
  }

  public getPointOfAttentionByLocationId(locationId: string): Observable < IPointOfAttention[] > {
    console.log('getPointOfAttentionByLocationId: ', locationId);
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

  public updatePointOfAttention(pointOfAttention: IPointOfAttention): Observable<boolean> {
    const UPDATE_POINT_OF_ATTENTION = gql`
        mutation updatePointOfAttention($input: PointOfAttentionUpdateInput!) {
          updatePointOfAttention(input: $input)
        }
    `;

    interface UpdatePointOfAttentionResponse {
      updatePointOfAttention: boolean;
    }

    return this.apollo.mutate<UpdatePointOfAttentionResponse>({
        mutation: UPDATE_POINT_OF_ATTENTION,
        variables: {
            input: {
                ...pointOfAttention
            }
        }
    }).pipe(map(({data}) => data.updatePointOfAttention));
}



}
