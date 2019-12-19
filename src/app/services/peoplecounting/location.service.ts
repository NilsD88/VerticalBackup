

import { MOCK_STORE_PEOPLE_COUNTING } from './../../mocks/people-counting';
import { MOCK_LOCATIONS_PEOPLE_COUNTING } from './../../mocks/people-counting';
import { NewLocationService } from 'src/app/services/new-location.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class PeopleCountingLocationService extends NewLocationService {

    constructor(public http: HttpClient, public apollo: Apollo) {
        super(
            http,
            apollo
        );
    }

    public getCoverOfLocationById(id: string): Observable < string > {
      const GET_IMAGE_OF_LOCATION_BY_ID = gql `
              query findLocationById($id: Long!) {
                  location: findLocationById(id: $id) {
                      image
                  }
              }
          `;
      interface GetImageLocationByIdResponse {
        location: IPeopleCountingLocation;
      }
      return this.apollo.query < GetImageLocationByIdResponse > ({
        query: GET_IMAGE_OF_LOCATION_BY_ID,
        fetchPolicy: 'network-only',
        variables: {
          id,
        }
      }).pipe(map(({
        data
      }) => data.location.image));
    }

    public getLocationById(locationId: string): Observable < IPeopleCountingLocation > {
      return new Observable < IPeopleCountingLocation > ((observer) => {
          observer.next(MOCK_STORE_PEOPLE_COUNTING);
          observer.complete();
      });
  }

  public getLocationsTree(): Observable < IPeopleCountingLocation[] > {
    return new Observable < IPeopleCountingLocation[] > ((observer) => {
        observer.next(MOCK_LOCATIONS_PEOPLE_COUNTING);
        observer.complete();
    });
}
}
