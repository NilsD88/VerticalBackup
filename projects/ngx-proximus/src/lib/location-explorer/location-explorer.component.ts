import { SubSink } from 'subsink';
import { MoveAssetsPopupComponent } from './move-assets-popup/move-assets-popup.component';
import { Router } from '@angular/router';
import { LocationService } from 'src/app/services/location.service';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef, ContentChild, TemplateRef } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { ILocation } from 'src/app/models/location.model';
import { AssetService } from 'src/app/services/asset.service';
import { Subject } from 'rxjs';
import {findLocationById} from 'src/app/shared/utils';
import { isNullOrUndefined } from 'util';
import { MatDialog } from '@angular/material';
import { PopupConfirmationComponent } from '../popup-confirmation/popup-confirmation.component';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'pxs-location-explorer',
  templateUrl: './location-explorer.component.html',
  styleUrls: ['./location-explorer.component.scss']
})
export class LocationExplorerComponent implements OnInit, OnDestroy {

  @ContentChild('extraTemplate', {static: false}) extraTemplateRef: TemplateRef<any>;

  @Input() rootLocation: ILocation;
  @Input() selectedLocation: ILocation;
  @Input() admin = false;
  @Input() ghostLocationId: string;
  @Input() leafUrl: string;
  @Input() searchBar = true;
  @Input() selectableLocation = false;

  @Output() changeLocation: EventEmitter<ILocation> = new EventEmitter<ILocation>();
  @Output() selectedLocationTree: EventEmitter<ILocation> = new EventEmitter<ILocation>();

  public tabs: {name: string, children: ILocation[]}[] = [];
  public selectedIndex = 0;
  public currentLocation: ILocation;
  public isDownloading = false;
  public isNullOrUndefined = isNullOrUndefined;
  public filter = {name: '' };
  public searchFilter$ = new Subject<any>();
  public searchResults: ILocation[];

  protected subs = new SubSink();

  constructor(
    protected locationService: LocationService,
    protected assetService: AssetService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected dialog: MatDialog,
    protected router: Router,
    protected sharedService: SharedService,
  ) {}

  ngOnInit() {
    this.initLocationTree();
    this.subs.add(
      this.locationService.searchLocationsWithFilter(this.searchFilter$).subscribe((locations: ILocation[]) => {
        this.searchResults = locations;
      })
    );
  }

  protected initLocationTree() {
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
    this.subs.add(
      this.locationService.getLocationsTree().subscribe((locations: ILocation[]) => {
        if (this.sharedService.user.hasRole('pxs:iot:location_admin')) {
          this.rootLocation = locations[0];
          this.tabs = [{
            name: this.rootLocation.name,
            children: this.rootLocation.children,
          }];
        } else {
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
        }
        this.checkIfSelectedLocation();
      })
    );
  }

  async wantToDeleteLocation(locationId: string) {

    const assets = await this.assetService.getAssetsByLocationId(locationId).toPromise();
    const PEOPLE_COUNTING_ASSETS = assets.filter(asset => asset.module.startsWith('PEOPLE_COUNTING'));
    if (assets.length > 0) {
      const wantToDelete = await this.dialog.open(PopupConfirmationComponent, {
        data: {
          title: `Are you sure to delete this location?`,
          content: PEOPLE_COUNTING_ASSETS.length ? 'Be careful, its people counting assets will be deleted and the others transfered' : null
        },
        minWidth: '320px',
        maxWidth: '400px',
        width: '100vw',
        maxHeight: '80vh',
      }).afterClosed().toPromise();
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
    this.subs.add(
      this.locationService.deleteLocation(locationId, locationIdToTransferAssets).subscribe((result: boolean) => {
        this.rootLocation = null;
        this.selectedLocation = this.currentLocation;
        this.changeDetectorRef.detectChanges();
        this.getLocations();
      })
    );
  }



  protected checkIfSelectedLocation() {
    this.currentLocation = this.rootLocation;
    this.isDownloading = true;
    if (this.selectedLocation && !isNullOrUndefined(this.selectedLocation.id)) {
      const { path } = findLocationById(this.rootLocation, this.selectedLocation.id);
      path.forEach(location => {
        this.goToChild(location);
      });
      this.selectedLocationTree.emit(this.currentLocation);
    } else {
      this.changeLocation.emit(this.rootLocation);
    }
    this.isDownloading = false;
  }

  selectLocation(location, emit) {
    this.currentLocation = location;
    if (emit) {
      this.changeLocation.emit(location);
    }
  }

  clickOnLocation(location) {
    if (this.selectableLocation) {
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
        this.router.navigateByUrl(`${this.leafUrl}/${location.id}`);
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

    this.subs.add(
      this.locationService.reorderLocation(location).subscribe()
    );
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
    this.subs.unsubscribe();
  }

}
