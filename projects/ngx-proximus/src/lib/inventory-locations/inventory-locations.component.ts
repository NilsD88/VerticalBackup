import { NewThresholdTemplateService } from 'src/app/services/new-threshold-templates';
import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { NewLocationService } from 'src/app/services/new-location.service';
import { ILocation } from 'src/app/models/g-location.model';
import { Subject, Observable } from 'rxjs';
import { IAsset, IPagedAssets } from 'src/app/models/g-asset.model';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

export interface IInventoryFilterBE {
  name: string;
  locationName: string;
  thresholdTemplateIds: string[];
}

@Component({
  selector: 'pxs-inventory-locations',
  templateUrl: './inventory-locations.component.html',
  styleUrls: ['./inventory-locations.component.scss']
})

export class InventoryLocationsComponent implements OnInit {

  public filterBE$ = new Subject<IInventoryFilterBE>();
  public filterBE: IInventoryFilterBE = {
    name: '',
    locationName: '',
    thresholdTemplateIds: []
  };

  public filterOptions = {
    thresholdTemplateOptions: [],
  };

  public listStyleValue = 'icons';

  public thresholdTemplatesLoading = false;
  public locationsLoading = false;

  public locations: ILocation[] = [];
  public locationUrl = '/private/smartmonitoring/detail/';

  public pageNumber = 0;
  public pageSize = 10;
  public totalItems = 0;

  public rootLocation: ILocation;
  public selectedLocation: ILocation;

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public locationService: NewLocationService,
    public newThresholdTemplateService: NewThresholdTemplateService,
    public newLocationService: NewLocationService,
    public activatedRoute: ActivatedRoute,
  ) {}

  async ngOnInit() {
    this.getPagedLocations();
    this.filterOptions.thresholdTemplateOptions = await this.newThresholdTemplateService.getThresholdTemplates().toPromise();
    this.newLocationService.getLocationsTree().subscribe((locations: ILocation[]) => {
      this.rootLocation = {
        id: null,
        parentId: null,
        geolocation: null,
        image: null,
        name: 'Locations',
        description: null,
        children: locations,
      };
      if (locations.length === 1) {
        this.selectedLocation = this.rootLocation.children[0];
      }
    });

    this.searchAssetsByFilter(this.filterBE$).subscribe((pagedAssets: IPagedAssets) => {
      this.locations = pagedAssets.assets;
      this.totalItems = pagedAssets.totalElements;
      this.locationsLoading = false;
    });

    this.activatedRoute.params.subscribe(async (params) => {
      if (params.id) {
        this.listStyleValue = 'map';
        this.selectedLocation = {id: params.id};
      }
    });
  }

  public changeFilterBE() {
    this.locationsLoading = true;
    this.locations = [];
    this.filterBE$.next(this.filterBE);
  }

  public changeLocation(location: ILocation) {
    this.selectedLocation = location;
    this.changeDetectorRef.detectChanges();
  }

  public pageChanged(evt) {
    this.pageNumber = evt.pageIndex;
    this.pageSize = evt.pageSize;
    this.getPagedLocations();
  }

  public async getPagedLocations() {
    try {
      this.locationsLoading = true;
      const locationsResult = await this.locationService.getPagedLeafLocations(this.pageNumber, this.pageSize, this.filterBE).toPromise();
      this.locations = locationsResult.locations;
      this.totalItems = locationsResult.totalElements;
      this.locationsLoading = false;
      return locationsResult;
    } catch (err) {
      this.locationsLoading = false;
    }
  }

  public listStyleOnChange(event) {
    const { value } = event;
    this.listStyleValue = value;
  }

  private searchAssetsByFilter(filters: Observable<IInventoryFilterBE>) {
    return filters.pipe(
      debounceTime(500),
      switchMap(() => {
        return this.locationService.getPagedLeafLocations(this.pageNumber, this.pageSize, this.filterBE);
      })
    );
  }
}
