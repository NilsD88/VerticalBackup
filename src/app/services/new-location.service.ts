import {ILocation} from './../models/g-location.model';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {HttpClient} from '@angular/common/http';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';

import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {environment} from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class NewLocationService {

  constructor(public http: HttpClient, private apollo: Apollo) {
  }


    // START APOLLO

  public createLocation(location: ILocation): Observable<ILocation> {
      const CREATE_LOCATION = gql`
          mutation CreateLocation($input: LocationCreateInput!) {
              location: createLocation(input: $input) {
                  id,
                  name,
                  image,
                  geolocation {
                      lat,
                      lng
                  }
              }
          }
      `;

    interface CreateLocationResponse {
      location: ILocation;
    }

    return this.apollo.mutate<CreateLocationResponse>({
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
        }
      }
    }).pipe(
      map(({data}) => data.location)
    );
  }

  public getLocations(): Observable<ILocation[]> {
      const GET_LOCATIONS = gql`
          query findAllLocations {
              locations: findAllLocations {
                  id,
                  name,
                  description,
                  parentLocation {
                      id
                  }
              }
          }
      `;

    interface GetLocationsQuery {
      locations: ILocation[] | null;
    }

    return this.apollo.query<GetLocationsQuery>({
      query: GET_LOCATIONS,
      fetchPolicy: 'network-only'
    }).pipe(map(({data}) => {
      return data.locations;
    }));
  }

  public getLocationById(id: string): Observable<ILocation> {
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
                      }
                  }
                  image,
                  geolocation {
                      lat
                      lng
                  }
              }
          }
      `;

    interface GetLocationByIdQuery {
      location: ILocation | null;
    }

    return this.apollo.query<GetLocationByIdQuery>({
      query: GET_LOCATION_BY_ID,
      fetchPolicy: 'network-only',
      variables: {
        id,
      }
    }).pipe(map(({data}) => data.location));
  }

  public getLocationsByName(name: string): Observable<ILocation[]> {
      const GET_LOCATION_BY_NAME = gql`
          query findLocationsByName($input: LocationFindByNameInput!) {
              locations: findLocationsByName(input: $input) {
                  id,
                  name,
              }
          }
      `;

    interface GetLocationByNameResponse {
      locations: ILocation[] | null;
    }

    return this.apollo.query<GetLocationByNameResponse>({
      query: GET_LOCATION_BY_NAME,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          name: name || ''
        }
      }
    }).pipe(map(({data}) => data.locations));
  }

  public updateLocation(location: ILocation): Observable<ILocation> {

      const UPDATE_LOCATION = gql`
          mutation UpdateLocation($input: LocationUpdateInput!) {
              location: updateLocation(input: $input) {
                  id,
                  name,
              }
          }
      `;

    interface UpdateLocationResponse {
      location: ILocation | null;
    }


    console.log(`[UPDATE] LOCATION:`);
    console.log(location);

    return this.apollo.mutate<UpdateLocationResponse>({
      mutation: UPDATE_LOCATION,
      variables: {
        input: {
          ...location
        }
      }
    }).pipe(
      map(({data}) => data.location)
    );
  }

  public reorderLocation(location: ILocation): Observable<ILocation> {
      const REORDER_LOCATION = gql`
          mutation ReorderLocation($input: LocationReorderInput!) {
              location: reorderLocation(input: $input) {
                  id,
                  name,
              }
          }
      `;

    interface ReorderLocationResponse {
      location: ILocation | null;
    }

    return this.apollo.mutate<ReorderLocationResponse>({
      mutation: REORDER_LOCATION,
      variables: {
        input: {
          id: location.id,
          leftId: location.leftId,
        }
      }
    }).pipe(
      map(({data}) => data.location)
    );
  }

  public deleteLocation(id: string): Observable<boolean> {

      const DELETE_LOCATION = gql`
          mutation DeleteLocation($input: LocationDeleteInput!) {
              deleteLocation(input: $input)
          }
      `;

    interface DeleteLocationResponse {
      deleteLocation: boolean;
    }

    console.log(`[DELETE] LOCATION:`);
    console.log(id);

    return this.apollo.mutate<DeleteLocationResponse>({
      mutation: DELETE_LOCATION,
      variables: {
        input: {
          id,
        }
      }
    }).pipe(
      map(({data}) => data.deleteLocation)
    );

  }

    // END APOLLO

  public getLocationsTree(): Observable<ILocation[]> {
    const url = `${environment.api}/locationtrees?org_id=1`;
    return this.http.get<ILocation[]>(url);
  }

    /*
    public getLocations(filter: any = null): Observable<ILocation[]>  {
        let request = this.locationsUrl;
        if (filter) {
            if (filter.name) {
                request += `?name=${filter.name}`;
            }
        }
        return this.http.get<ILocation[]>(request);
    }
    */

  public searchLocationsWithFilter(filters: Observable<any>) {
    return filters.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(filter => {
        // return this.getLocations(filter);
        return this.getLocationsByName(filter.name);
      })
    );
  }

}
