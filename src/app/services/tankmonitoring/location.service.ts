import { NewLocationService } from 'src/app/services/new-location.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { ILocation } from 'src/app/models/g-location.model';
import { environment } from 'src/environments/environment';

const MODULE_NAME = 'TANK_MONITORING';

@Injectable({
    providedIn: 'root'
})
export class TankMonitoringLocationService extends NewLocationService {

    constructor(public http: HttpClient, public apollo: Apollo) {
        super(
            http,
            apollo
        );
    }

    public getLocationsTree(): Observable < ILocation[] > {
      const url = `${environment.baseUrl}/location/locationtrees?module=${MODULE_NAME}`;
      return this.http.get < IPeopleCountingLocation[] > (url);
    }

}
