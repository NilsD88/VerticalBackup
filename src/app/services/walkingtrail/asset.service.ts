import { PeopleCountingAssetService } from './../peoplecounting/asset.service';
import { IPeopleCountingAsset } from 'src/app/models/peoplecounting/asset.model';
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
import { environment } from 'src/environments/environment';
import { Intervals } from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';


@Injectable({
  providedIn: 'root'
})
export class WalkingTrailAssetService extends PeopleCountingAssetService {
  constructor(
    public apollo: Apollo,
    public http: HttpClient,
  ) {
    super(
      apollo,
      http
    );
  }

  public MODULE_NAME = 'WALKING_TRAIL';

  public getAssetsDataByIds(ids: string[], interval: Intervals, from: number, to: number): Observable < IPeopleCountingAsset[] > {
    let idsParams = `ids=${ids[0]}`;
    if (ids.length > 1) {
      for (let index = 1; index < ids.length; index++) {
        idsParams += `&ids=${ids[index]}`;
      }
    }
    return this.http.get < IPeopleCountingAsset [] >
      (`${environment.baseUrl}/assets/data?${idsParams}&module=${this.MODULE_NAME}&interval=${interval}&from=${from}&to=${to}`);
  }


}
