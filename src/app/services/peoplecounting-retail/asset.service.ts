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
import { Intervals } from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';


const MODULE_NAME = 'PEOPLE_COUNTING_RETAIL';
@Injectable({
  providedIn: 'root'
})
export class PeopleCountingRetailAssetService extends PeopleCountingAssetService {
  constructor(
    public apollo: Apollo,
    public http: HttpClient,
  ) {
    super(
      apollo,
      http
    );
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


}
