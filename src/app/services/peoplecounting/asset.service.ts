import {
  NewAssetService
} from '../new-asset.service';
import {
  Injectable
} from '@angular/core';
import {
  Apollo
} from 'apollo-angular';
import {
  HttpClient
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PeopleCountingAssetService extends NewAssetService {
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
