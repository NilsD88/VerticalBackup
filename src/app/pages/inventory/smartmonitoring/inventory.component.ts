import {Component, OnInit} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {Asset} from '../../../models/asset.model';
import {AssetService} from '../../../services/asset.service';
import {FilterService} from '../../../services/filter.service';
import {SharedService} from '../../../services/shared.service';
import {LocationsService} from '../../../services/locations.service';

@Component({
  selector: 'pvf-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  public filter = {
    name: '',
    thresholdTemplates: [],
    locationType: null,
    locations: []
  };

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

  constructor(public assetService: AssetService,
              public filterService: FilterService,
              public sharedService: SharedService,
              public locationsService: LocationsService) {
  }

  async ngOnInit() {
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

      this.filterOptions.thresholdTemplateOptions = await thresholdTemplatePromise;
      this.filterOptions.locationTypesOptions = await locationTypesPromise;
      this.submitFilter();
    } catch (err) {
      this.assetsLoading = false;
      console.error(err);
    }
  }

  public async onLocationTypeChange() {
    this.filter.locations = [];
    if (this.filter.locationType) {
      this.filterOptions.locationsOptions = await this.locationsService.getLocations();
    } else {
      this.filterOptions.locationsOptions = [];
    }
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
      statuses: []
    };
  }

  public async submitFilter(): Promise<void> {
    this.getPagedAssets();
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
      console.log(assetsResult);
      this.assets = assetsResult.assets;
      this.totalItems = assetsResult.totalElements;
      this.page = assetsResult.pageNumber;

      this.assetsLoading = false;
      return assetsResult;
    } catch (err) {
      this.assetsLoading = false;
    }
  }

}
