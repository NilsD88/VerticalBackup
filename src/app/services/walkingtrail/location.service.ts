import { NewLocationService } from 'src/app/services/new-location.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { MOCK_LOCATIONS_WALKING_TRAIL } from 'src/app/mocks/newlocations';
import { MOCK_TRAIL_WALKING_TRAIL } from 'src/app/mocks/walking-trail';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';

@Injectable({
    providedIn: 'root'
})

export class WalkingTrailLocationService extends NewLocationService {

    constructor(public http: HttpClient, public apollo: Apollo) {
        super(
            http,
            apollo
        );
    }

    public getLocationsTree(): Observable < IPeopleCountingLocation[] > {
        return new Observable < IPeopleCountingLocation[] > ((observer) => {
            observer.next(MOCK_LOCATIONS_WALKING_TRAIL);
            observer.complete();
        });
    }

    public getLocationById(locationId: string): Observable < IPeopleCountingLocation > {
        return new Observable < IPeopleCountingLocation > ((observer) => {
            observer.next(MOCK_TRAIL_WALKING_TRAIL);
            observer.complete();
        });
    }
}
