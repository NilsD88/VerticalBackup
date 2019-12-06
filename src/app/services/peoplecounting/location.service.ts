import { NewLocationService } from 'src/app/services/new-location.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Intervals } from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';

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

    public getLocationsDataByIds(ids: string[], interval: Intervals, from: number, to: number, moduleName: string): Observable < IPeopleCountingLocation[] > {
      let idsParams = `ids=${ids[0]}`;
      if (ids.length > 1) {
        for (let index = 1; index < ids.length; index++) {
          idsParams += `&ids=${ids[index]}`;
        }
      }
      return this.http.get < IPeopleCountingLocation [] >
        (`${environment.baseUrl}/locations/data?${idsParams}&module=${moduleName}&interval=${interval}&from=${from}&to=${to}`);
    }
}
