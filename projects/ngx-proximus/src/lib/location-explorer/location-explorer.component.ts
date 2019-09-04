import { Inject, Optional } from '@angular/core';
import { NewLocationService } from 'src/app/services/new-location.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { INewLocation } from 'src/app/models/new-location';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { NewAsset, INewAsset } from 'src/app/models/new-asset.model';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {findLocationById} from 'src/app/shared/utils';


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

  @Output() notify: EventEmitter<INewLocation> = new EventEmitter<INewLocation>();
  @Output() changeLocation: EventEmitter<INewLocation> = new EventEmitter<INewLocation>();

  tabs: {name: string, sublocations: INewLocation[]}[] = [];
  selectedIndex = 0;
  currentLocation: INewLocation;
  selectedAsset: INewAsset;
  loadingAsset = false;
  assets: INewAsset[] = [];
  isDownloading = false;

  private assetsRequestSource = new Subject();

  constructor(
    private newAssetService: NewAssetService,
    private newLocationService: NewLocationService
  ) {}

  ngOnInit() {

    /*
    this.selectedLocationsRequestSource.pipe(
      concatMap(req => {
        return this.newLocationService.getLocationById(+req);
      }),
      tap(req => {
        if (!isNullOrUndefined(req.parentId)) {
          this.selectedLocationsRequestSource.next(req.parentId);
        }
      })
    ).subscribe(location => {
      const { sublocations } = this.findLocationById(this.selectedLocationsTree, location.id);
      this.tabs.unshift({
        name: location.name,
        sublocations,
      });
      if (isNullOrUndefined(location.parentId)) {
        this.tabs.unshift({
          name: 'Locations',
          sublocations: this.selectedLocationsTree.sublocations,
        });
      }
    });
    */

    this.assetsRequestSource.pipe(
      switchMap(req => this.newAssetService.getAssetsByLocationId(+this.currentLocation.id))
    ).subscribe((data: NewAsset[]) => {
      this.loadingAsset = false;
      this.currentLocation.assets = data;
    });

    /*
    this.tabs = [{
      name: this.selectedLocation.name,
      sublocations: this.selectedLocation.sublocations
    }];
    */

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
    this.newLocationService.getLocations().subscribe((locations: INewLocation[]) => {
      this.rootLocation = {
        id: null,
        parentId: null,
        locationType: null,
        geolocation: null,
        floorPlan: null,
        name: 'Locations',
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

  private checkIfSelectedLocation() {
    this.currentLocation = this.rootLocation;
    this.isDownloading = true;
    if (this.selectedLocation && this.selectedLocation.id) {
      const { path } = findLocationById(this.rootLocation, +this.selectedLocation.id);
      for (const location of path) {
        this.goToSublocation(location);
      }
    }
    this.isDownloading = false;
  }

  selectLocation(location) {
    this.currentLocation = location;
    if (this.displayAssets) {
      this.getAssetsBySelectedLocation();
    }
    this.notify.emit(location);
    this.changeLocation.emit(location);
  }

  clickOnLocation(location) {
    if (!this.displayAssets && !this.admin) {
      this.selectLocation(location);
    }
  }

  goToSublocation(location) {
    if (this.selectLocation !== location) {
      this.selectLocation(location);
    }
    this.selectedIndex = this.tabs.length;
    this.tabs.push(location);
  }

  selectedIndexChange(index) {
    const length = this.tabs.length;
    this.selectedIndex = index;

    if (index < length) {
      this.selectLocation(this.tabs[index]);
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

}
