import { IWalkingTrailLocation } from './../../models/walkingtrail/location.model';
import { NewLocationService } from 'src/app/services/new-location.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { MOCK_LOCATIONS_WALKING_TRAIL } from 'src/app/mocks/newlocations';
import { MOCK_TRAIL_WALKING_TRAIL } from 'src/app/mocks/walking-trail';

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

    public getLocationsTree(): Observable < IWalkingTrailLocation[] > {
        return new Observable < IWalkingTrailLocation[] > ((observer) => {
            observer.next(MOCK_LOCATIONS_WALKING_TRAIL);
            observer.complete();
        });
    }

    public getLocationById(locationId: string): Observable < IWalkingTrailLocation > {
        return new Observable < IWalkingTrailLocation > ((observer) => {
            observer.next(MOCK_TRAIL_WALKING_TRAIL);
            observer.complete();
        });
    }
}
