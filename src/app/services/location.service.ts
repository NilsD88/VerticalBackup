import { IField } from '../models/field.model';
import {
  ILocation, IPagedLocations
} from '../models/location.model';
import {
  Injectable
} from '@angular/core';
import {
  Observable
} from 'rxjs/internal/Observable';
import {
  HttpClient
} from '@angular/common/http';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  catchError
} from 'rxjs/operators';

import {
  Apollo
} from 'apollo-angular';
import gql from 'graphql-tag';
import {
  environment
} from 'src/environments/environment';
import { throwError, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    public http: HttpClient,
    public apollo: Apollo,
  ) {}


  // START APOLLO

  public createLocation(location: ILocation): Observable < ILocation > {
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
      location: ILocation;
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
          module: location.module || 'SMART_MONITORING'
        }
      }
    }).pipe(
      map(({
        data
      }) => data.location)
    );
  }

  public getLocations(): Observable < ILocation[] > {
    const GET_LOCATIONS = gql `
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

    return this.apollo.query < GetLocationsQuery > ({
      query: GET_LOCATIONS,
      fetchPolicy: 'network-only'
    }).pipe(map(({
      data
    }) => {
      return data.locations;
    }));
  }

  public getLocationById(id: string): Observable < ILocation > {
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
                  customFields {
                    keyId,
                    value
                  }
              }
          }
      `;

    interface GetLocationByIdQuery {
      location: ILocation | null;
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

  public getLocationsByName(name: string): Observable < ILocation[] > {
    const GET_LOCATION_BY_NAME = gql `
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

    return this.apollo.query < GetLocationByNameResponse > ({
      query: GET_LOCATION_BY_NAME,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          name: name || ''
        }
      }
    }).pipe(map(({
      data
    }) => data.locations));
  }

  public updateLocation(location: ILocation): Observable < ILocation > {

    const UPDATE_LOCATION = gql `
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

    return this.apollo.mutate < UpdateLocationResponse > ({
      mutation: UPDATE_LOCATION,
      variables: {
        input: {
          ...location
        }
      }
    }).pipe(
      map(({
        data
      }) => data.location)
    );
  }

  public reorderLocation(location: ILocation): Observable < ILocation > {
    const REORDER_LOCATION = gql `
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

    return this.apollo.mutate < ReorderLocationResponse > ({
      mutation: REORDER_LOCATION,
      variables: {
        input: {
          id: location.id,
          leftId: location.leftId,
        }
      }
    }).pipe(
      map(({
        data
      }) => data.location)
    );
  }

  public deleteLocation(id: string, locationIdToTransferAssets: string): Observable < boolean > {

    const DELETE_LOCATION = gql `
          mutation DeleteLocation($input: LocationDeleteInput!) {
              deleteLocation(input: $input)
          }
      `;

    interface DeleteLocationResponse {
      deleteLocation: boolean;
    }

    return this.apollo.mutate < DeleteLocationResponse > ({
      mutation: DELETE_LOCATION,
      variables: {
        input: {
          id,
          assetHeirId: locationIdToTransferAssets
        }
      }
    }).pipe(
      map(({
        data
      }) => data.deleteLocation)
    );

  }

  public getCustomFields(): Observable < IField [] > {
    const GET_CUSTOM_FIELDS = gql `
      query findFields($subjectType: String!) {
          fields: getKeysBySubjectType(subjectType: $subjectType) {
            id,
            label {
              fr,
              en,
              nl
            }
            type,
            options
          }
      }
    `;

    interface GetCustomFieldsResponse {
      fields: IField[];
    }

    return this.apollo.query < GetCustomFieldsResponse > ({
      query: GET_CUSTOM_FIELDS,
      fetchPolicy: 'network-only',
      variables: {
        subjectType: 'LOCATION'
      }
    }).pipe(map(({
      data,
    }) => data.fields));
  }

  public getImageOfLocationById(id: string): Observable < string > {
    const GET_IMAGE_OF_LOCATION_BY_ID = gql `
            query findLocationById($id: Long!) {
                location: findLocationById(id: $id) {
                    images,
                    image
                }
            }
        `;

    interface GetImageLocationByIdResponse {
      location: ILocation;
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

  public getPagedLeafLocations(
    pageNumber: number = 0,
    pageSize: number = 10,
    filter = {},
    moduleName: string = null
    ): Observable < IPagedLocations > {
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
      pagedLeafLocations: IPagedLocations;
    }

    return this.apollo.query < GetPagedLeafLocationsResponse > ({
      query: GET_PAGED_LEAF_LOCATIONS,
      variables: {
        input: {
          pageNumber,
          pageSize,
          ...filter,
          moduleName
        }
      },
      fetchPolicy: 'network-only'
    }).pipe(map(({
      data
    }) => {
      return data.pagedLeafLocations;
    }));
  }

  public getPagedLocations(
    pageNumber: number = 0,
    pageSize: number = 10,
    filter = {},
    moduleName: string = null
    ): Observable < IPagedLocations > {
    const GET_PAGED_LOCATIONS = gql `
      query findLocationsByFilterPaged($input: PagedLeafLocationsFindByFilterInput!) {
        pagedLocations: findLocationsByFilterPaged(input: $input) {
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

    interface GetPagedLocationsResponse {
      pagedLocations: IPagedLocations;
    }

    return this.apollo.query < GetPagedLocationsResponse > ({
      query: GET_PAGED_LOCATIONS,
      variables: {
        input: {
          pageNumber,
          pageSize,
          ...filter,
          moduleName
        }
      },
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }).pipe(
      map(({
        data
      }) => {
        return data.pagedLocations;
      })
    );
  }

  // END APOLLO

  public getLocationsTree(): Observable < ILocation[] > {
    const url = `${environment.baseUrl}/location/locationtrees`;
    return this.http.get < ILocation[] > (url);
  }



  public searchLocationsWithFilter(filters: Observable < any > ) {
    return filters.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(filter => {
        return this.getLocationsByName(filter.name);
      })
    );
  }

}
