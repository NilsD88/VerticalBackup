import { NewLocationService } from './new-location.service';
import { Injectable } from '@angular/core';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { NewAssetService } from './new-asset.service';
import { IAsset } from '../models/g-asset.model';
import { ILocation } from '../models/g-location.model';

@Injectable({
  providedIn: 'root'
})
export class GlobaleSearchService {

    constructor(
      private newAssetService: NewAssetService,
      private newLocationsService: NewLocationService
    ) { }

    public searchTerm(terms: Observable<string>) {
      return terms.pipe(
        debounceTime(500),
        switchMap(term => {
          if (!term || term.length === 0) {
            return of([]);
          }
          const assetsPromise: Promise<IAsset[]> = this.newAssetService.getAssetsByName(term).toPromise();
          const locationsPromise: Promise<ILocation[]> = this.newLocationsService.getLocationsByName(term).toPromise();
          return Promise.all([assetsPromise, locationsPromise]);
        })
      );
    }

    public searchLocationTerm(terms: Observable<string>) {
      return terms.pipe(
        debounceTime(500),
        switchMap(term => {
          return this.newLocationsService.getLocationsByName(term);
        })
      );
    }

}