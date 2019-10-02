import { NewLocationService } from 'src/app/services/new-location.service';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { ILocation } from 'src/app/models/g-location.model';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { IAsset } from 'src/app/models/g-asset.model';
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

  @Input() rootLocation: ILocation;
  @Input() selectedLocation: ILocation;
  @Input() asset: IAsset;
  @Input() admin = false;
  @Input() displayAssets = false;
  @Input() ghostLocationId: string;

  @Output() changeLocation: EventEmitter<ILocation> = new EventEmitter<ILocation>();

  tabs: {name: string, children: ILocation[]}[] = [];
  selectedIndex = 0;
  currentLocation: ILocation;
  selectedAsset: IAsset;
  loadingAsset = false;
  assets: IAsset[] = [];
  isDownloading = false;
  isNullOrUndefined = isNullOrUndefined;

  public filter = {name: null };
  public searchFilter$ = new Subject<any>();
  public searchResults: ILocation[];

  private assetsRequestSource = new Subject();

  constructor(
    private newAssetService: NewAssetService,
    private newLocationService: NewLocationService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {

    this.assetsRequestSource.pipe(
      switchMap(req => this.newAssetService.getAssetsByLocationId(+this.currentLocation.id))
    ).subscribe((data: IAsset[]) => {
      this.loadingAsset = false;
      this.currentLocation.assets = data;
    });

    this.initLocationTree();

    this.newLocationService.searchLocationsWithFilter(this.searchFilter$).subscribe((locations: ILocation[]) => {
      this.searchResults = locations;
    });
  }

  private initLocationTree() {
    this.isDownloading = true;
    if (this.rootLocation) {
      this.tabs = [{
        name: this.rootLocation.name,
        children: this.rootLocation.children,
      }];
      this.checkIfSelectedLocation();
    } else {
      this.getLocations();
    }
  }

  getLocations() {
    this.isDownloading = true;
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
      this.tabs = [{
        name: this.rootLocation.name,
        children: locations,
      }];
      this.checkIfSelectedLocation();
    });
  }

  deleteLocation(locationId: string) {
    this.newLocationService.deleteLocation(locationId).subscribe((result: boolean) => {
      this.rootLocation = null;
      this.selectedLocation = this.currentLocation;
      this.changeDetectorRef.detectChanges();
      this.getLocations();
    });
  }

  private checkIfSelectedLocation() {
    this.currentLocation = this.rootLocation;
    this.isDownloading = true;
    console.log('checkIfSelectedLocation');
    console.log(this.selectedLocation);
    if (this.selectedLocation && !isNullOrUndefined(this.selectedLocation.id)) {
      console.log('checkIfSelectedLocation if');
      console.log(this.selectedLocation.id);
      console.log(this.rootLocation);
      const { path } = findLocationById(this.rootLocation, this.selectedLocation.id);
      for (const location of path) {
        this.goToChild(location);
      }
    } else {
      console.log('checkIfSelectedLocation else');
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
        if (this.ghostLocationId !== location.id) {
          this.selectLocation(location, true);
        }
      }
    }
  }

  openLocation(location) {
    this.goToChild(location);
    this.changeLocation.emit(location);
  }

  goToChild(location) {
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
    const children = this.currentLocation.children;
    const { previousIndex, currentIndex } = event;
    let leftId = null;

    moveItemInArray(children, previousIndex, currentIndex);

    if (currentIndex > 0) {
      leftId = children[currentIndex - 1].id;
    }

    const location: ILocation = {
      id: children[currentIndex].id,
      leftId,
    };

    this.newLocationService.reorderLocation(location).subscribe((location: ILocation) => {
      console.log(location);
    });
  }

  public onFilterChange() {
    this.searchFilter$.next({...this.filter});
  }

  public selectAutocompletedOption(location: ILocation) {
    this.filter = { name: null };
    this.selectedLocation = location;
    this.isDownloading = true;
    this.changeDetectorRef.detectChanges();
    this.isDownloading = false;
    this.initLocationTree();
  }

}
