import {
  AssetService
} from '../asset.service';
import {
  Injectable
} from '@angular/core';
import {
  Apollo
} from 'apollo-angular';
import {
  HttpClient
} from '@angular/common/http';
import { Intervals } from 'projects/ngx-proximus/src/lib/chart-controls/chart-controls.component';
import { environment } from 'src/environments/environment';
import { IPeopleCountingAsset } from 'src/app/models/peoplecounting/asset.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeopleCountingAssetService extends AssetService {
  constructor(
    public apollo: Apollo,
    public http: HttpClient,
  ) {
    super(
      apollo,
      http
    );
  }

  public getAssetsDataByIds(ids: string[], interval: Intervals, from: number, to: number, moduleName: string): Observable < IPeopleCountingAsset[] > {
    let idsParams = `ids=${ids[0]}`;
    if (ids.length > 1) {
      for (let index = 1; index < ids.length; index++) {
        idsParams += `&ids=${ids[index]}`;
      }
    }
    return this.http.get < IPeopleCountingAsset [] >
      (`${environment.baseUrl}/peopleCounting/assets?${idsParams}&module=${moduleName}&interval=${interval}&from=${from}&to=${to}`);
  }

}
