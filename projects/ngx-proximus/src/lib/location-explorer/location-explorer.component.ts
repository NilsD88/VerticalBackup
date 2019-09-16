import { NewLocationService } from 'src/app/services/new-location.service';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { INewLocation } from 'src/app/models/new-location';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { NewAsset, INewAsset } from 'src/app/models/new-asset.model';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {findLocationById} from 'src/app/shared/utils';
import { isNullOrUndefined } from 'util';


@Component({
  selector: 'pxs-location-explorer',
  templateUrl: './location-explorer.component.html',
  styleUrls: ['./location-explorer.component.scss']
})
export class LocationExplorerComponent implements OnInit {

  @Input() rootLocation: INewLocation;
  @Input() selectedLocation: INewLocation;
  @Input() asset: INewAsset;
  @Input() admin = false;
  @Input() displayAssets = false;

  @Output() changeLocation: EventEmitter<INewLocation> = new EventEmitter<INewLocation>();

  tabs: {name: string, sublocations: INewLocation[]}[] = [];
  selectedIndex = 0;
  currentLocation: INewLocation;
  selectedAsset: INewAsset;
  loadingAsset = false;
  assets: INewAsset[] = [];
  isDownloading = false;
  isNullOrUndefined = isNullOrUndefined;

  public filter = {name: null };
  public searchFilter$ = new Subject<any>();
  public searchResults: INewLocation[];

  private assetsRequestSource = new Subject();

  constructor(
    private newAssetService: NewAssetService,
    private newLocationService: NewLocationService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {

    this.assetsRequestSource.pipe(
      switchMap(req => this.newAssetService.getAssetsByLocationId(+this.currentLocation.id))
    ).subscribe((data: NewAsset[]) => {
      this.loadingAsset = false;
      this.currentLocation.assets = data;
    });

    this.initLocationTree();

    this.newLocationService.searchLocationsWithFilter(this.searchFilter$).subscribe((locations: INewLocation[]) => {
      this.searchResults = locations;
    });
  }

  private initLocationTree() {
    this.isDownloading = true;
    if (this.rootLocation) {
      this.tabs = [{
        name: this.rootLocation.name,
        sublocations: this.rootLocation.sublocations,
      }];
      this.checkIfSelectedLocation();
    } else {
      this.getLocations();
    }
  }

  getLocations() {
    this.isDownloading = true;
    this.newLocationService.getLocationsTree().then((locations: INewLocation[]) => {
      this.rootLocation = {
        id: null,
        parentId: null,
        locationType: null,
        geolocation: null,
        floorPlan: null,
        name: 'Locations',
        description: null,
        sublocationsId: null,
        sublocations: locations,
      };
      this.tabs = [{
        name: this.rootLocation.name,
        sublocations: locations,
      }];
      this.checkIfSelectedLocation();
    });
  }

  deleteLocation(locationId: number) {
    this.newLocationService.deleteLocation(locationId).subscribe((result) => {
      this.rootLocation = null;
      this.selectedLocation = this.currentLocation;
      this.changeDetectorRef.detectChanges();
      this.getLocations();
    });
  }

  private checkIfSelectedLocation() {
    this.currentLocation = this.rootLocation;
    this.isDownloading = true;
    if (this.selectedLocation && !isNullOrUndefined(this.selectedLocation.id)) {
      const { path } = findLocationById(this.rootLocation, +this.selectedLocation.id);
      for (const location of path) {
        this.goToSublocation(location);
      }
    } else {
      this.changeLocation.emit(this.rootLocation);
    }
    this.isDownloading = false;
  }

  selectLocation(location, emit) {
    this.currentLocation = location;
    if (this.displayAssets) {
      this.getAssetsBySelectedLocation();
    }
    if (emit) {
      this.changeLocation.emit(location);
    }
  }

  clickOnLocation(location) {
    if (!this.displayAssets && !this.admin) {
      if (this.currentLocation !== location) {
        this.selectLocation(location, true);
      }
    }
  }

  openLocation(location) {
    this.goToSublocation(location);
    this.changeLocation.emit(location);
  }

  goToSublocation(location) {
    if (this.selectLocation !== location) {
      this.selectLocation(location, false);
    }
    this.selectedIndex = this.tabs.length;
    this.tabs.push(location);
  }

  selectedIndexChange(index) {
    const length = this.tabs.length;
    this.selectedIndex = index;

    if (index < length) {
      this.selectLocation(this.tabs[index], true);
      this.tabs.splice(index + 1, length - index + 1);
    }
  }

  getAssetsBySelectedLocation() {
    if (!this.currentLocation.assets) {
      this.currentLocation.assets = [];
      this.loadingAsset = true;
      this.assetsRequestSource.next();
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.currentLocation.sublocations, event.previousIndex, event.currentIndex);
  }

  public onFilterChange() {
    this.searchFilter$.next({...this.filter});
  }

  public selectAutocompletedOption(location: INewLocation) {
    this.filter = { name: null };
    this.selectedLocation = location;
    this.isDownloading = true;
    this.changeDetectorRef.detectChanges();
    this.isDownloading = false;
    this.initLocationTree();
  }

}
