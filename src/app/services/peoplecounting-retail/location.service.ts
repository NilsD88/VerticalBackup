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

const MODULE_NAME = 'PEOPLE_COUNTING_RETAIL';

@Injectable({
    providedIn: 'root'
})
export class PeopleCountingRetailLocationService extends PeopleCountingLocationService {

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

    public getLocationById(id: string): Observable < IPeopleCountingLocation > {
        // TODO: get location by id with the backend with all the assets (id, name)
        return new Observable < IPeopleCountingLocation > ((observer) => {
            observer.next(MOCK_TRAIL_WALKING_TRAIL);
            observer.complete();
        });


        const GET_LOCATION_BY_ID = gql `
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
                    asset {
                      id,
                      name
                    }
                }
            }
        `;

      interface GetLocationByIdQuery {
        location: IPeopleCountingLocation | null;
      }

      return this.apollo.query < GetLocationByIdQuery > ({
        query: GET_LOCATION_BY_ID,
        fetchPolicy: 'network-only',
        variables: {
          id,
        }
      }).pipe(map(({
        data
      }) => data.location));
    }


    public getPagedLeafLocations(pageNumber: number = 0, pageSize: number = 10, filter = {}): Observable < IPagedPeopleCountingLocations > {
       return super.getPagedLeafLocations(
         pageNumber,
         pageSize,
         filter,
         MODULE_NAME
       );
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
            customFields: location.customFields,
            module: MODULE_NAME
          }
        }
      }).pipe(
        map(({
          data
        }) => data.location)
      );
    }

    public getLocationsDataByIds(ids: string[], interval: Intervals, from: number, to: number): Observable < IPeopleCountingLocation[] > {
      return super.getLocationsDataByIds(
        ids,
        interval,
        from,
        to,
        MODULE_NAME
      );
    }

}
