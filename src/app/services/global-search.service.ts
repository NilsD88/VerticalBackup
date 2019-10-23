import { LocationsService } from './locations.service';
import { Injectable } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NewAssetService } from './new-asset.service';

@Injectable()
export class GlobaleSearchService {

    constructor(private newAssetService: NewAssetService, private locationsService: LocationsService) { }

    public searchTerm(terms: Observable<string>) {
      return terms.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(term => {
          const assetsResultPromise = this.newAssetService.getAssetsByName(term).toPromise();
          //const locationsResultPromise = this.locationsService.getLocationsByName(term);
          //return Promise.all([assetsResultPromise, locationsResultPromise]);
          return Promise.all([assetsResultPromise]);
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