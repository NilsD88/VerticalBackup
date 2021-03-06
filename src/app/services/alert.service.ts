import {
  Injectable
} from '@angular/core';
import {
  Observable
} from 'rxjs/internal/Observable';
import {
  IPagedAlerts,
  IAlert
} from '../models/alert.model';
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
} from '../pages/alerts/alerts.component';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private apollo: Apollo,
  ) {}

  public numberOfUnreadAlerts$ = new Subject<number>();

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
      this.numberOfUnreadAlerts$.next(data.number);
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
              range {
                from,
                to
              }
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

  public getAlertsByDateRange(dateRange: DateRange): Observable < IAlert[] > {
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
          range {
            from,
            to
          }
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

  public getAlertsByAssetIdAndDateRange(assetId: string, from: number, to: number): Observable < IAlert[] > {
    const GET_ALERTS_BY_ID_AND_DATE_RANGE = gql `
      query findAlertsByAssetIdAndDateRange($input: AlertsByAssetIdAndDateRangeInput!) {
        alerts: findAlertsByAssetIdAndDateRange(input: $input) {
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

    interface GetAlertsByIdAndDateRangeResponse {
      alerts: IAlert[];
    }

    return this.apollo.query < GetAlertsByIdAndDateRangeResponse > ({
      query: GET_ALERTS_BY_ID_AND_DATE_RANGE,
      variables: {
        input: {
          assetId,
          dateRange: {
            from,
            to
          }
        }
      },
      fetchPolicy: 'network-only'
    }).pipe(map(({
      data
    }) => {
      return data.alerts;
    }));
  }

  public getLastAlertsByAssetId(assetId: string, amount: number = 5): Observable < IAlert[] > {
    const GET_LAST_ALERTS_BT_ASSET_ID = gql `
      query findLastAlertsByAssetId($input: LastAlertsInput!) {
        alerts: findLastAlertsByAssetId(input: $input) {
          id,
          read,
          sensorType {
            id,
            name,
            postfix
          },
          thresholdTemplateName,
          severity,
          label,
          timestamp,
          value,
          thing {
            id,
            devEui,
            name
          }
        }
      }`;

    interface GetLastAlertsByAssetIdResponse {
      alerts: IAlert[];
    }

    return this.apollo.query < GetLastAlertsByAssetIdResponse > ({
      query: GET_LAST_ALERTS_BT_ASSET_ID,
      variables: {
        input: {
          assetId,
          amount
        }
      },
      fetchPolicy: 'network-only'
    }).pipe(map(({
      data
    }) => {
      return data.alerts;
    }));
  }

  public getAlertById(id: string, ): Observable < IAlert > {
    const GET_ALERT_BY_ID = gql `
      query findAssetById($id: Long!) {
        asset: findAlertsByAssetIdAndDateRange(id: $id) {
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
