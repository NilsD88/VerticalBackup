import {
  NewAssetService
} from '../new-asset.service';
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


@Injectable({
  providedIn: 'root'
})
export class WalkingTrailAssetService extends NewAssetService {
  constructor(
    public apollo: Apollo,
    public http: HttpClient,
  ) {
    super(
      apollo,
      http
    );
  }


}
