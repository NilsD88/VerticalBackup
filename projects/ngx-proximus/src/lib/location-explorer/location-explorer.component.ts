import { PointOfAttentionService } from 'src/app/services/point-of-attention.service';
import { IPointOfAttention } from 'src/app/models/point-of-attention.model';
import { DeleteConfirmationPopupComponent } from './delete-confirmation-popup/delete-confirmation-popup.component';
import { MoveAssetsPopupComponent } from './move-assets-popup/move-assets-popup.component';
import { Router } from '@angular/router';
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
import { MatDialog } from '@angular/material';


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
  @Input() displayPointsOfAttention = false;
  @Input() ghostLocationId: string;
  @Input() customAssetService;
  @Input() assetUrl = '/private/smartmonitoring/detail/';
  @Input() pointOfAttentionUrl = 'private/smartmonitoring/points-of-attention/point-of-attention/';
  @Input() leafUrl: string;
  @Input() assetPicker = false;
  @Input() searchBar = true;


  @Output() changeLocation: EventEmitter<ILocation> = new EventEmitter<ILocation>();
  @Output() assetClicked: EventEmitter<IAsset> = new EventEmitter<IAsset>();
  @Output() pointOfAttentionClicked: EventEmitter<IPointOfAttention> = new EventEmitter<IPointOfAttention>();

  tabs: {name: string, children: ILocation[]}[] = [];
  selectedIndex = 0;
  currentLocation: ILocation;
  selectedAsset: IAsset;
  loadingAssets = false;

  loadingPointsOfAttention = false;
  isDownloading = false;
  isNullOrUndefined = isNullOrUndefined;

  public filter = {name: '' };
  public searchFilter$ = new Subject<any>();
  public searchResults: ILocation[];

  private assetsRequestSource = new Subject();
  private pointsOfAttentionRequestSource = new Subject();

  private subscriptions: Subscription[] = [];

  constructor(
    private newAssetService: NewAssetService,
    private newLocationService: NewLocationService,
    private pointOfAttentionService: PointOfAttentionService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit() {

    console.log('rootLocation', this.rootLocation);


    const assetsRequestSourcePipe = this.assetsRequestSource.pipe(
      switchMap(req => {
        if (req === 'STOP') {
          return of(this.currentLocation.assets);
        }
        if (isNullOrUndefined(this.currentLocation.id)) {
          return of([]);
        } else {
          if (this.customAssetService) {
            return this.customAssetService.getAssetsByLocationId(this.currentLocation.id);
          } else {
            return this.newAssetService.getAssetsByLocationId(this.currentLocation.id);
          }
        }
      })
    );

    const pointsOfAttentionRequestSourcePipe = this.pointsOfAttentionRequestSource.pipe(
      switchMap(req => {
        if (req === 'STOP') {
          return of(this.currentLocation.pointsOfAttention);
        } else {
          return this.pointOfAttentionService.getPointOfAttentionByLocationId(this.currentLocation.id);
        }
      })
    );

    this.subscriptions.push(
      assetsRequestSourcePipe.subscribe((data: IAsset[]) => {
        this.loadingAssets = false;
        this.currentLocation.assets = data;
      }),
      pointsOfAttentionRequestSourcePipe.subscribe((data: IPointOfAttention[]) => {
        this.loadingPointsOfAttention = false;
        this.currentLocation.pointsOfAttention = data;
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

  async wantToDeleteLocation(locationId: string) {

    const assets = await this.newAssetService.getAssetsByLocationId(locationId).toPromise();
    if (assets.length > 0) {
      const wantToDelete = await this.dialog.open(DeleteConfirmationPopupComponent).afterClosed().toPromise();
      if (wantToDelete) {
        const locationIdToTransferAssets = await this.dialog.open(MoveAssetsPopupComponent, {
          data: {
            rootLocation: this.rootLocation,
            selectedLocation: this.currentLocation || this.selectedLocation || this.rootLocation,
            ghostLocationId: locationId
          },
          maxHeight: '80vh',
        }).afterClosed().toPromise();
        if (!isNullOrUndefined(locationIdToTransferAssets)) {
          this.deleteLocation(locationId, locationIdToTransferAssets);
        } else {
          this.deleteLocation(locationId);
        }
      }
    } else {
      this.deleteLocation(locationId);
    }
  }

  private deleteLocation(locationId: string, locationIdToTransferAssets: string = null) {
    this.newLocationService.deleteLocation(locationId, locationIdToTransferAssets).subscribe((result: boolean) => {
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
    if (this.displayAssets || this.assetPicker) {
      this.getAssetsBySelectedLocation();
    }
    if (this.displayPointsOfAttention) {
      this.getPointsOfAttentionBySelectedLocation();
    }
    if (emit) {
      this.changeLocation.emit(location);
    }
  }

  clickOnLocation(location) {
    if (!this.displayAssets && !this.assetPicker && !this.displayPointsOfAttention && !this.admin) {
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
      if (!(location.children || []).length && this.leafUrl) {
        this.router.navigateByUrl(`${this.leafUrl}${location.id}`);
        return;
      }
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
      this.loadingAssets = true;
      this.assetsRequestSource.next();
    } else {
      this.assetsRequestSource.next('STOP');
    }
  }

  getPointsOfAttentionBySelectedLocation() {
    if (!this.currentLocation.pointsOfAttention || !(this.currentLocation.pointsOfAttention || []).length) {
      this.currentLocation.pointsOfAttention = [];
      this.loadingPointsOfAttention = true;
      this.pointsOfAttentionRequestSource.next();
    } else {
      this.pointsOfAttentionRequestSource.next('STOP');
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

  public clickOnAsset(asset: IAsset) {
    this.assetClicked.emit(asset);
    if (!this.assetPicker) {
      this.router.navigateByUrl(`${this.assetUrl}${asset.id}`);
    }
  }

  public clickOnPointOfAttention(pointOfAttention: IPointOfAttention) {
    this.pointOfAttentionClicked.emit(pointOfAttention);
    this.router.navigateByUrl(`${this.pointOfAttentionUrl}${pointOfAttention.id}`);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
