import { LocationsService } from './locations.service';
import { AssetService } from './asset.service';
import { Injectable } from '@angular/core';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class GlobaleSearchService {

    constructor(private assetService: AssetService, private locationsService: LocationsService) { }

    public searchTerm(terms: Observable<string>) {
      return terms.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(term => {
          const assetsResultPromise = this.assetService.getAssets({name: term});
          const locationsResultPromise = this.locationsService.getLocationsByName(term);
          return Promise.all([assetsResultPromise, locationsResultPromise]);
        })
      );
    }

    public searchLocationTerm(terms: Observable<string>) {
      return terms.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(term => {
          return this.locationsService.getLocationsByName(term);
        })
      );
    }

}