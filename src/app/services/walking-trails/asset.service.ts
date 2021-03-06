import {
  PeopleCountingAssetService
} from './../peoplecounting/asset.service';
import {
  IPeopleCountingAsset
} from 'src/app/models/peoplecounting/asset.model';
import {
  Injectable
} from '@angular/core';
import {
  Observable
} from 'rxjs';
import {
  Apollo
} from 'apollo-angular';
import {
  HttpClient
} from '@angular/common/http';
import {
  Intervals
} from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';


const MODULE_NAME = 'PEOPLE_COUNTING_WALKING_TRAILS';
@Injectable({
  providedIn: 'root'
})
export class WalkingTrailsAssetService extends PeopleCountingAssetService {
  constructor(
    public apollo: Apollo,
    public http: HttpClient,
  ) {
    super(
      apollo,
      http
    );
  }

  public getAssets(): Observable < IPeopleCountingAsset[] > {

    const GET_ASSETS_BY_MODULE = gql `
        query FindAssetsByModule($input: AssetFindByModuleInput!) {
          assets: findAssetsByModule(input: $input) {
            id,
            name,
            things {
              devEui,
              batteryPercentage,
              sensors {
                sensorType {
                  id,
                  name
                }
                value,
                timestamp
              }
            }
          }
        }
      `;

    interface GetAssetsWalkingTrailsResponse {
      assets: IPeopleCountingAsset[];
    }

    return this.apollo.query < GetAssetsWalkingTrailsResponse > ({
      query: GET_ASSETS_BY_MODULE,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          moduleName: MODULE_NAME
        }
      }
    }).pipe(map(({
      data
    }) => data.assets));

  }

  public getAssetsDataByIds(ids: string[], interval: Intervals, from: number, to: number): Observable < IPeopleCountingAsset[] > {
    return super.getAssetsDataByIds(
      ids,
      interval,
      from,
      to,
      MODULE_NAME
    );
  }

  public getAssetsByLocationId(locationId: string): Observable < IPeopleCountingAsset[] > {
    return super.getAssetsByLocationId(locationId, MODULE_NAME);
  }


}
