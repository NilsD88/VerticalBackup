import {Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {Asset} from '../../../models/asset.model';
import {AssetService} from '../../../services/asset.service';
import {FilterService} from '../../../services/filter.service';
import {SharedService} from '../../../services/shared.service';
import {LocationsService} from '../../../services/locations.service';
import { NewLocationService } from 'src/app/services/new-location.service';
import { ILocation } from 'src/app/models/g-location.model';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { GlobaleSearchService } from 'src/app/services/global-search.service';

@Component({
  selector: 'pvf-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  @ViewChild('inputSearch') set content(content: ElementRef) { this.inputSearch = content;}
  inputSearch: ElementRef;

  public filter = {
    name: '',
    thresholdTemplates: [],
    locationType: null,
    locations: [],
    children: []
  };

  public listStyleValue = 'icons';
  public showFilter = false;

  public thresholdTemplatesLoading = false;
  public locationsLoading = false;
  public locationTypesLoading = false;
  public assetsLoading = false;
  public statusesLoading = false;

  public filterOptions = {
    thresholdTemplateOptions: [],
    locationTypesOptions: [],
    locationsOptions: [],
    statuses: []
  };

  public assets: Asset[] = [];
  public page = 0;
  public totalItems = 0;
  public pagesize = 10;

  public rootLocation: ILocation;
  public selectedLocation: ILocation;

  // Search autocomplete for location
  public searchTextLocation: string;
  public myControl = new FormControl();
  public searchResultsLocation: any[];
  public searchTermLocation$ = new Subject<string>();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public assetService: AssetService,
    public filterService: FilterService,
    public sharedService: SharedService,
    public locationsService: LocationsService,
    public newLocationService: NewLocationService,
    public globaleSearchService: GlobaleSearchService) {
  }

  async ngOnInit() {

    this.globaleSearchService.searchLocationTerm(this.searchTermLocation$)
      .subscribe(locations => {
        this.searchResultsLocation = locations;
      });

    this.assetsLoading = true;
    const defaultFilter: any = this.sharedService.getDefaultFilter('INVENTORYFILTER');
    this.filter = defaultFilter ? defaultFilter : this.filter;
    if (!isNullOrUndefined(defaultFilter) && !isNullOrUndefined(defaultFilter.locationType)) {
      this.onLocationTypeChange();
      this.filter.locations = defaultFilter.locations;
    }
    try {
      const thresholdTemplatePromise = this.filterService.getThresholdTemplates();
      const locationTypesPromise = this.locationsService.getLocationTypes();
      const locationsPromise = this.locationsService.getLocations();

      this.filterOptions.thresholdTemplateOptions = await thresholdTemplatePromise;
      this.filterOptions.locationTypesOptions = await locationTypesPromise;
      this.filterOptions.locationsOptions = await locationsPromise;

      this.submitFilter();
    } catch (err) {
      this.assetsLoading = false;
      console.error(err);
    }


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
  }

  public async onLocationTypeChange() {
    if (this.filter.locationType) {
      this.filterOptions.locationsOptions = await this.locationsService.getLocations(this.filter.locationType);
    } else {
      this.filterOptions.locationsOptions = await this.locationsService.getLocations();
    }
    this.filter.locations = [];
    this.filter.children = [];
    this.getPagedAssets();
  }

  public setDefaultFilter() {
    this.sharedService.setDefaultFilter('INVENTORYFILTER', this.filter);
  }

  public revertDefaultFilter() {
    const defaultFilter = this.sharedService.getDefaultFilter('INVENTORYFILTER');
    this.filter = defaultFilter ? defaultFilter : {
      name: '',
      thresholdTemplates: [],
      locationType: null,
      locations: [],
      children: [],
      statuses: []
    };
  }

  public async submitFilter(): Promise<void> {
    this.getPagedAssets();
  }

  public changeLocation(location: ILocation) {
    this.selectedLocation = location;
    this.changeDetectorRef.detectChanges();
  }

  public pageChanged(evt) {
    this.page = evt.pageIndex;
    this.pagesize = evt.pageSize;
    this.getPagedAssets();
  }

  public toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  public async getPagedAssets() {
    try {
      this.assetsLoading = true;
      const assetsResult = await this.assetService.getPagedAssets(this.filter, this.page, this.pagesize);
      this.assets = assetsResult.data;
      this.totalItems = assetsResult.totalElements;
      this.page = assetsResult.pageNumber;

      this.assetsLoading = false;
      return assetsResult;
    } catch (err) {
      this.assetsLoading = false;
    }
  }

  public listStyleOnChange(event) {
    const { value } = event;
    this.listStyleValue = value;
  }

  public searchLocationChanged(event) {
    if (event) {
      if (event.length > 2) {
        this.searchTermLocation$.next(event);
      }
    }
  }

  public selectAnAutocompletedOption(option: ILocation) {
    this.searchTextLocation = option.name;
    this.updateLocation(option);
    // TODO: request to update asset according to the location
  }

  public updateLocation(location: ILocation) {
    switch (location.constructor.name) {
      case 'Sublocation':
        this.filter.children = [location.id];
        this.filter.locations = [];
        break;
      case 'Location':
        this.filter.locations = [location.id];
        this.filter.children = [];
        break;
      default :
        this.filter.locations = [];
        this.filter.children = [];
    }
    this.getPagedAssets();
  }
}