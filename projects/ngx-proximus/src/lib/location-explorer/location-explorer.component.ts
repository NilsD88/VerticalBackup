import { NewLocationService } from 'src/app/services/new-location.service';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { ILocation } from 'src/app/models/g-location.model';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { IAsset } from 'src/app/models/g-asset.model';
import { Subject, Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {findLocationById} from 'src/app/shared/utils';
import { isNullOrUndefined } from 'util';
import { Observable } from 'apollo-link';


@Component({
  selector: 'pxs-location-explorer',
  templateUrl: './location-explorer.component.html',
  styleUrls: ['./location-explorer.component.scss']
})
export class LocationExplorerComponent implements OnInit, OnDestroy {

  @Input() rootLocation: ILocation;
  @Input() selectedLocation: ILocation;
  @Input() asset: IAsset;
  @Input() admin = false;
  @Input() displayAssets = false;
  @Input() ghostLocationId: string;
  @Input() customAssetService;
  @Input() assetUrl = '/private/smartmonitoring/detail2/';


  @Output() changeLocation: EventEmitter<ILocation> = new EventEmitter<ILocation>();

  tabs: {name: string, children: ILocation[]}[] = [];
  selectedIndex = 0;
  currentLocation: ILocation;
  selectedAsset: IAsset;
  loadingAsset = false;
  assets: IAsset[] = [];
  isDownloading = false;
  isNullOrUndefined = isNullOrUndefined;

  public filter = {name: '' };
  public searchFilter$ = new Subject<any>();
  public searchResults: ILocation[];

  private assetsRequestSource = new Subject();

  private subscriptions: Subscription[] = [];

  constructor(
    private newAssetService: NewAssetService,
    private newLocationService: NewLocationService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {


    const assetsRequestSourcePipe = this.assetsRequestSource.pipe(
      switchMap(req => {
        if (req === 'STOP') {
          return of(this.currentLocation.assets);
        }
        if (isNullOrUndefined(this.currentLocation.id)) {
          return of([]);
        } else {
          if (this.customAssetService) {
            console.log('use costum asset service');
            return this.customAssetService.getAssetsByLocationId(this.currentLocation.id);
          } else {
            return this.newAssetService.getAssetsByLocationId(this.currentLocation.id);
          }
        }
      })
    );

    this.subscriptions.push(
      assetsRequestSourcePipe.subscribe((data: IAsset[]) => {
        this.loadingAsset = false;
        this.currentLocation.assets = data;
      })
    );

    this.initLocationTree();

    this.subscriptions.push(
      this.newLocationService.searchLocationsWithFilter(this.searchFilter$).subscribe((locations: ILocation[]) => {
        this.searchResults = locations;
      })
    );
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
    this.subscriptions.push(
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
      })
    );
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
    if (this.selectedLocation && !isNullOrUndefined(this.selectedLocation.id)) {
      const { path } = findLocationById(this.rootLocation, this.selectedLocation.id);
      for (const location of path) {
        this.goToChild(location);
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
    if (!this.currentLocation.assets || !(this.currentLocation.assets || []).length) {
      this.currentLocation.assets = [];
      this.loadingAsset = true;
      this.assetsRequestSource.next();
    } else {
      this.assetsRequestSource.next('STOP');
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

    this.newLocationService.reorderLocation(location).subscribe();
  }

  public onFilterChange() {
    this.searchFilter$.next({...this.filter});
  }

  public selectAutocompletedOption(location: ILocation) {
    this.filter = { name: '' };
    this.selectedLocation = location;
    this.isDownloading = true;
    this.changeDetectorRef.detectChanges();
    this.isDownloading = false;
    this.initLocationTree();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
