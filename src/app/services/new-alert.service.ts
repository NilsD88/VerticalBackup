import {
  Injectable
} from '@angular/core';
import {
  Observable
} from 'rxjs/internal/Observable';
import {
  IPagedAlerts,
  IAlert
} from '../models/g-alert.model';
import {
  Apollo
} from 'apollo-angular';
import gql from 'graphql-tag';

import {
  debounceTime,
  switchMap,
  map
} from 'rxjs/operators';
import {
  DateRange
} from 'projects/ngx-proximus/src/lib/date-range-selection/date-range-selection.component';
import {
  IAlertFilterBE
} from '../pages/alerts/smartmonitoring/alerts.component';

@Injectable({
  providedIn: 'root'
})
export class NewAlertService {

  constructor(
    private apollo: Apollo,
  ) {}


  // START APOLLO


  public getNumberOfUnreadAlerts(): Observable < number > {
    const GET_NUMBER_OF_UNREAD_ALERTS = gql `
      query getNumberOfUnreadAlerts {
        number: getNumberOfUnreadAlerts
      }
    `;

    interface GetNumberOfUnreadAlertsResponse {
      number: number;
    }

    return this.apollo.watchQuery < GetNumberOfUnreadAlertsResponse > ({
      query: GET_NUMBER_OF_UNREAD_ALERTS,
      fetchPolicy: 'network-only',
      pollInterval: 1000 * 60 * 10 // check unread alert numbers every 10 minutes
    }).valueChanges.pipe(map(({
      data
    }) => {
      return data.number;
    }));
  }

  public getPagedAlerts(pageNumber: number = 0, pageSize: number = 10): Observable < IPagedAlerts > {
    const GET_PAGED_ALERTS = gql `
      query findPagedAlerts($input: PagedAlertInput!) {
        findPagedAlerts(input: $input) {
          totalElements,
          totalPages,
          alerts {
              id,
              read,
              sensorType {
                id,
                name,
                postfix
              },
              thresholdTemplateName,
              thing {
                id,
                name,
                devEui
              },
              asset {
                id,
                name
                location {
                  id,
                  name
                },
              }
              severity,
              label,
              timestamp,
              value,
          }
        }
      }`;

    interface GetPagedAlertsResponse {
      findPagedAlerts: IPagedAlerts;
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
      return data.findPagedAlerts;
    }));
  }

  public getAlertsByDateRange(dateRange: DateRange) {
    const GET_ALERTS_BY_DATE_RANGE = gql `
      query findAlertsByDateRange($input: DateRange!) {
        alerts: findAlertsByDateRange(input: $input) {
          id,
          read,
          sensorType {
            id,
            name,
            postfix
          },
          thresholdTemplateName,
          thing {
            id,
            name,
            devEui
          },
          asset {
            id,
            name
            location {
              id,
              name
            },
          }
          severity,
          label,
          timestamp,
          value,
        }
      }`;

    interface GetAlertsByDateRangeResponse {
      alerts: IAlert[];
    }

    return this.apollo.query < GetAlertsByDateRangeResponse > ({
      query: GET_ALERTS_BY_DATE_RANGE,
      variables: {
        input: {
          from: dateRange.fromDate.getTime(),
          to: dateRange.toDate.getTime(),
        }
      },
      fetchPolicy: 'network-only'
    }).pipe(map(({
      data
    }) => {
      return data.alerts;
    }));
  }

  public getAlertsByDateRangeOBS(filters: Observable < IAlertFilterBE > ) {
    return filters.pipe(
      debounceTime(500),
      switchMap(filter => {
        return this.getAlertsByDateRange(filter.dateRange);
      })
    );
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

  public readByAlertIds(ids: string[]): Observable < boolean > {
    const SET_READ_BY_ALERT_IDS = gql `
      mutation setReadByAlertIds($input: IdListInput!) {
        setReadByAlertIds(input: $input)
      }
    `;

    interface SetReadByAlertIdsResponse {
      setReadByAlertIds: boolean;
    }

    return this.apollo.mutate < SetReadByAlertIdsResponse > ({
      mutation: SET_READ_BY_ALERT_IDS,
      variables: {
        input: {
          ids
        }
      }
    }).pipe(
      map(({
        data
      }) => data.setReadByAlertIds)
    );
  }

  public unreadByAlertIds(ids: string[]): Observable < boolean > {
    const SET_UNREAD_BY_ALERT_IDS = gql `
      mutation setUnreadByAlertIds($input: IdListInput!) {
        setUnreadByAlertIds(input: $input)
      }
    `;

    interface SetUnreadByAlertIdsResponse {
      setUnreadByAlertIds: boolean;
    }

    return this.apollo.mutate < SetUnreadByAlertIdsResponse > ({
      mutation: SET_UNREAD_BY_ALERT_IDS,
      variables: {
        input: {
          ids
        }
      }
    }).pipe(
      map(({
        data
      }) => data.setUnreadByAlertIds)
    );
  }


}
