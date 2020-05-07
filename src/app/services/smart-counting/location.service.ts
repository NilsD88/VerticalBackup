import { PeopleCountingLocationService } from './../peoplecounting/location.service';
import { IPagedPeopleCountingLocations, IPeopleCountingLocation } from './../../models/peoplecounting/location.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Intervals } from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';

const MODULE_NAME = 'PEOPLE_COUNTING_RETAIL';

@Injectable({
    providedIn: 'root'
})
export class SmartCountingLocationService extends PeopleCountingLocationService {

    constructor(public http: HttpClient, public apollo: Apollo) {
        super(
            http,
            apollo
        );
    }

    public getLocationsTree(): Observable < IPeopleCountingLocation[] > {
      const url = `${environment.baseUrl}/location/locationtrees?module=${MODULE_NAME}`;
      return this.http.get < IPeopleCountingLocation[] > (url);
    }

    public getPagedLeafLocations(pageNumber: number = 0, pageSize: number = 10, filter = {}): Observable < IPagedPeopleCountingLocations > {
      return super.getPagedLeafLocations(
        pageNumber,
        pageSize,
        filter,
        MODULE_NAME
      );
    }

    public getPagedLocations(pageNumber: number = 0, pageSize: number = 10, filter = {}): Observable < IPagedPeopleCountingLocations > {
      return super.getPagedLocations(
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
            parentId: location.parentId,
            name: location.name,
            description: location.description,
            geolocation: location.geolocation,
            image: location.image,
            customFields: location.customFields,
            module: MODULE_NAME,
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
