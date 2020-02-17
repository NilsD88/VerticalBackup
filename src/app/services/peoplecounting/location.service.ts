import {LocationService} from 'src/app/services/location.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs';
import {IPeopleCountingLocation} from 'src/app/models/peoplecounting/location.model';
import gql from 'graphql-tag';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {Intervals} from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';

@Injectable({
  providedIn: 'root'
})

export class PeopleCountingLocationService extends LocationService {

  constructor(public http: HttpClient, public apollo: Apollo) {
    super(
      http,
      apollo
    );
  }

  public getCoverOfLocationById(id: string): Observable<string[]> {
      const GET_IMAGE_OF_LOCATION_BY_ID = gql`
          query findLocationById($id: Long!) {
              location: findLocationById(id: $id) {
                  images
              }
          }
      `;

    interface GetImageLocationByIdResponse {
      location: IPeopleCountingLocation;
    }

    return this.apollo.query <GetImageLocationByIdResponse>({
      query: GET_IMAGE_OF_LOCATION_BY_ID,
      fetchPolicy: 'network-only',
      variables: {
        id,
      }
    }).pipe(map(({
                   data
                 }) => data.location.images));
  }

  public getLocationsDataByIds(ids: string[], interval: Intervals, from: number, to: number, moduleName: string): Observable<IPeopleCountingLocation[]> {
    let idsParams = `ids=${ids[0]}`;
    if (ids.length > 1) {
      for (let index = 1; index < ids.length; index++) {
        idsParams += `&ids=${ids[index]}`;
      }
    }
    return this.http.get <IPeopleCountingLocation[]>
    (`${environment.baseUrl}/peopleCounting/locations?${idsParams}&module=${moduleName}&interval=${interval}&from=${from}&to=${to}`);
  }

  public getLocationById(id: string): Observable<IPeopleCountingLocation> {
      const GET_LOCATION_BY_ID = gql`
          query findLocationById($id: Long!) {
              location: findLocationById(id: $id) {
                  id,
                  name,
                  description,
                  parent {
                      id,
                      name,
                      geolocation {
                          lat,
                          lng
                      },
                      image
                  }
                  image,
                  geolocation {
                      lat
                      lng
                  },
                  assets {
                      id,
                      name
                  },
                  customFields {
                      keyId,
                      value
                  }
              }
          }
      `;

    interface GetLocationByIdQuery {
      location: IPeopleCountingLocation | null;
    }

    return this.apollo.query <GetLocationByIdQuery>({
      query: GET_LOCATION_BY_ID,
      fetchPolicy: 'network-only',
      variables: {
        id,
      }
    }).pipe(map(({
                   data
                 }) => data.location));
  }

  public getLocationByIdWithoutParent(id: string): Observable<IPeopleCountingLocation> {
      const GET_LOCATION_BY_ID = gql`
          query findLocationById($id: Long!) {
              location: findLocationById(id: $id) {
                  id,
                  name,
                  description,
                  image,
                  geolocation {
                      lat
                      lng
                  },
                  assets {
                      id,
                      name,
                      geolocation {
                          lat
                          lng
                      }
                  },
                  customFields {
                      keyId,
                      value
                  }
              }
          }
      `;

    interface GetLocationByIdQuery {
      location: IPeopleCountingLocation | null;
    }

    return this.apollo.query <GetLocationByIdQuery>({
      query: GET_LOCATION_BY_ID,
      fetchPolicy: 'network-only',
      variables: {
        id,
      }
    }).pipe(map(({
                   data
                 }) => data.location));
  }

}
