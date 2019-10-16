import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { IPagedAlerts, IAlert } from '../models/g-alert.model';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  tap,
  map
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewAssetService {

  constructor(
    public http: HttpClient,
    private apollo: Apollo,
  ) {}


  // START APOLLO

  public getPagedAlerts(pageNumber: number = 0, pageSize: number = 10): Observable < IPagedAlerts > {
    const GET_PAGED_ALERTS = gql `
      query findAllAlertsPaged($input: PagedAlertsInput!) {
        findAllAlertsPaged(input: $input) {
          totalElements,
          totalPages,
          alerts {
              id,
          }
        }
      }`;

    interface GetPagedAlertsResponse {
        findAllAlertsPaged: IPagedAlerts;
    }

    return this.apollo.query < GetPagedAlertsResponse > ({
      query: GET_PAGED_ALERTS,
      variables: {
        input: {
          pageNumber,
          pageSize,
        }
      },
      fetchPolicy: 'network-only'
    }).pipe(map(({
      data
    }) => {
      return data.findAllAlertsPaged;
    }));
  }

  public getAlertById(id: string): Observable < IAlert > {
    const GET_ALERT_BY_ID = gql `
      query findAssetById($id: Long!) {
        asset: findAssetById(id: $id) {
          id,
        }
      }
    `;

    interface GetAlertByIdResponse {
        asset: IAlert;
    }

    return this.apollo.query < GetAlertByIdResponse > ({
      query: GET_ALERT_BY_ID,
      variables: {
        input: {
          id
        }
      },
      fetchPolicy: 'network-only'
    }).pipe(map(({
      data
    }) => {
      return data.asset;
    }));
  }

}
