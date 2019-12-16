import { NewThresholdTemplateService } from 'src/app/services/new-threshold-templates';
import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { NewLocationService } from 'src/app/services/new-location.service';
import { ILocation } from 'src/app/models/g-location.model';
import { Subject, Observable } from 'rxjs';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { IAsset, IPagedAssets } from 'src/app/models/g-asset.model';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

export interface IInventoryFilterBE {
  name: string;
  locationName: string;
  thresholdTemplateIds: string[];
}

@Component({
  selector: 'pxs-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})

export class InventoryComponent implements OnInit {

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
  public assetsLoading = false;

  public assets: IAsset[] = [];
  public assetUrl = '/private/smartmonitoring/detail/';

  public pageNumber = 0;
  public pageSize = 10;
  public totalItems = 0;

  public rootLocation: ILocation;
  public selectedLocation: ILocation;

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public assetService: NewAssetService,
    public newThresholdTemplateService: NewThresholdTemplateService,
    public newLocationService: NewLocationService,
    public activatedRoute: ActivatedRoute,
  ) {}

  async ngOnInit() {
    this.getPagedAssets();
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
      this.assets = pagedAssets.assets;
      this.totalItems = pagedAssets.totalElements;
      this.assetsLoading = false;
    });

    this.activatedRoute.params.subscribe(async (params) => {
      if (params.id) {
        this.listStyleValue = 'map';
        this.selectedLocation = {id: params.id};
      }
    });
  }

  public changeFilterBE() {
    this.assetsLoading = true;
    this.assets = [];
    this.filterBE$.next(this.filterBE);
  }

  public changeLocation(location: ILocation) {
    this.selectedLocation = location;
    this.changeDetectorRef.detectChanges();
  }

  public pageChanged(evt) {
    console.log(evt);
    this.pageNumber = evt.pageIndex;
    this.pageSize = evt.pageSize;
    this.getPagedAssets();
  }

  public async getPagedAssets() {
    try {
      this.assetsLoading = true;
      const assetsResult = await this.assetService.getPagedAssets(this.pageNumber, this.pageSize, this.filterBE).toPromise();
      this.assets = assetsResult.assets;
      this.totalItems = assetsResult.totalElements;
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

  private searchAssetsByFilter(filters: Observable<IInventoryFilterBE>) {
    return filters.pipe(
      debounceTime(500),
      switchMap(() => {
        return this.assetService.getPagedAssets(this.pageNumber, this.pageSize, this.filterBE);
      })
    );
  }
}
