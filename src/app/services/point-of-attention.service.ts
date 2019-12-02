import { IPointOfAttention } from './../models/point-of-attention.model';
import {
  Injectable
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import {
  Apollo
} from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { MOCK_POINTS_OF_ATTENTION } from '../mocks/point-of-attention';

@Injectable({
  providedIn: 'root'
})
export class PointOfAttentionService {

  constructor(
    private apollo: Apollo,
    private http: HttpClient,
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
}
