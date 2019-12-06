import { PeopleCountingLocationService } from './../peoplecounting/location.service';
import { IPagedPeopleCountingLocations, IPeopleCountingLocation } from './../../models/peoplecounting/location.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { MOCK_LOCATIONS_WALKING_TRAIL } from 'src/app/mocks/newlocations';
import { MOCK_TRAIL_WALKING_TRAIL } from 'src/app/mocks/walking-trail';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Intervals } from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';

const MODULE_NAME = 'PEOPLE_COUNTING_WALKING_TRAIL';

@Injectable({
    providedIn: 'root'
})
export class WalkingTrailLocationService extends PeopleCountingLocationService {

    constructor(public http: HttpClient, public apollo: Apollo) {
        super(
            http,
            apollo
        );
    }

    public getLocationsTree(): Observable < IPeopleCountingLocation[] > {
      // TODO: Remove those lines when the backend is ready
      return new Observable < IPeopleCountingLocation[] > ((observer) => {
          observer.next(MOCK_LOCATIONS_WALKING_TRAIL);
          observer.complete();
      });

      const url = `${environment.baseUrl}/location/locationtrees?org_id=1&module=${MODULE_NAME}`;
      return this.http.get < IPeopleCountingLocation[] > (url);
      return new Observable < IPeopleCountingLocation[] > ((observer) => {
          observer.next(MOCK_LOCATIONS_WALKING_TRAIL);
          observer.complete();
      });
    }

    public getLocationById(locationId: string): Observable < IPeopleCountingLocation > {
        // TODO: get location by id with the backend with all the assets (id, name)
        return new Observable < IPeopleCountingLocation > ((observer) => {
            observer.next(MOCK_TRAIL_WALKING_TRAIL);
            observer.complete();
        });
    }

    public getPagedLeafLocations(pageNumber: number = 0, pageSize: number = 10, filter = {}): Observable < IPagedPeopleCountingLocations > {
        const GET_PAGED_LEAF_LOCATIONS = gql `
          query findLeafLocationsByFilterPaged($input: PagedLeafLocationsFindByFilterInput!) {
            pagedLeafLocations: findLeafLocationsByFilterPaged(input: $input) {
              totalElements,
              totalPages,
              locations {
                  id,
                  name,
                  description,
                  image,
                  parent {
                    id,
                    name,
                    image
                  }
              }
            }
          }`;

        interface GetPagedLeafLocationsResponse {
          pagedLeafLocations: IPagedPeopleCountingLocations;
        }

        return this.apollo.query < GetPagedLeafLocationsResponse > ({
          query: GET_PAGED_LEAF_LOCATIONS,
          variables: {
            input: {
              organizationId: 1,
              pageNumber,
              pageSize,
              ...filter
            }
          },
          fetchPolicy: 'network-only'
        }).pipe(map(({
          data
        }) => {
          return data.pagedLeafLocations;
        }));
    }

    public createLocation(location: IPeopleCountingLocation): Observable < IPeopleCountingLocation > {
      const CREATE_LOCATION = gql `
            mutation CreateLocation($input: LocationCreateInput!) {
                location: createLocation(input: $input) {
                    id,
                    name,
                    image,
                    geolocation {
                        lat,
                        lng
                    },
                    module
                }
            }
        `;

      interface CreateLocationResponse {
        location: IPeopleCountingLocation;
      }

      return this.apollo.mutate < CreateLocationResponse > ({
        mutation: CREATE_LOCATION,
        variables: {
          input: {
            // TODO: REMOVE ORG_ID
            organizationId: 1,
            parentId: location.parentId,
            name: location.name,
            description: location.description,
            geolocation: location.geolocation,
            image: location.image,
            module: 'PEOPLE_COUNTING_WALKING_TRAIL'
            // TODO: when the backend will be ready
            /*
            images: location.images,
            module: XXXX
            */
          }
        }
      }).pipe(
        map(({
          data
        }) => data.location)
      );
    }

    public getLocationsDataByIds(ids: string[], interval: Intervals, from: number, to: number): Observable < IPeopleCountingLocation[] > {
      console.log('getLocationsDataByIds');
      let idsParams = `ids=${ids[0]}`;
      if (ids.length > 1) {
        for (let index = 1; index < ids.length; index++) {
          idsParams += `&ids=${ids[index]}`;
        }
      }
      return this.http.get < IPeopleCountingLocation [] >
        (`${environment.baseUrl}/locations/data?${idsParams}&module=${MODULE_NAME}&interval=${interval}&from=${from}&to=${to}`);
    }

}
