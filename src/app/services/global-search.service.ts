import { LocationService } from './location.service';
import { Injectable } from '@angular/core';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AssetService } from './asset.service';
import { IAsset } from '../models/asset.model';
import { ILocation } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class GlobaleSearchService {

    constructor(
      private assetService: AssetService,
      private locationsService: LocationService
    ) { }

    public searchTerm(terms: Observable<string>) {
      return terms.pipe(
        debounceTime(500),
        switchMap(term => {
          if (!term || term.length === 0) {
            return of([]);
          }
          const assetsPromise: Promise<IAsset[]> = this.assetService.getAssetsByName(term).toPromise();
          const locationsPromise: Promise<ILocation[]> = this.locationsService.getLocationsByName(term).toPromise();
          return Promise.all([assetsPromise, locationsPromise]);
        })
      );
    }

    public searchLocationTerm(terms: Observable<string>) {
      return terms.pipe(
        debounceTime(500),
        switchMap(term => {
          return this.locationsService.getLocationsByName(term);
        })
      );
    }

}