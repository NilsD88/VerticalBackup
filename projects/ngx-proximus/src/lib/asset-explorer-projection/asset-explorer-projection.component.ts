import { cloneDeep } from 'lodash';
import { SharedService } from './../../../../../src/app/services/shared.service';
import { LocationExplorerComponent } from './../location-explorer/location-explorer.component';
import { Router } from '@angular/router';
import { LocationService } from 'src/app/services/location.service';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { AssetService } from 'src/app/services/asset.service';
import { IAsset } from 'src/app/models/asset.model';
import { Subject, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { MatDialog } from '@angular/material';
import { findLocationById } from 'src/app/shared/utils';


@Component({
  selector: 'pxs-asset-explorer-projection',
  templateUrl: '../location-explorer/location-explorer.component.html',
  styleUrls: ['../location-explorer/location-explorer.component.scss']
})
export class AssetExplorerProjectionComponent extends LocationExplorerComponent implements OnInit, OnDestroy {

  @Input() customAssetService;
  @Input() assetUrl = '/private/smart-monitoring/detail/';
  @Input() assetPicker = false;

  @Output() assetClicked: EventEmitter<IAsset> = new EventEmitter<IAsset>();

  public selectedAsset: IAsset;
  public loadingAssets = false;

  private assetsRequestSource = new Subject();

  constructor(
    protected assetService: AssetService,
    protected locationService: LocationService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected dialog: MatDialog,
    protected router: Router,
    protected sharedService: SharedService,
  ) {
    super(
      locationService,
      assetService,
      changeDetectorRef,
      dialog,
      router,
      sharedService
    );
  }

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
            return this.customAssetService.getAssetsByLocationId(this.currentLocation.id);
          } else {
            return this.assetService.getAssetsByLocationId(this.currentLocation.id);
          }
        }
      })
    );

    this.subs.add(
      assetsRequestSourcePipe.subscribe((data: IAsset[]) => {
        this.loadingAssets = false;
        this.currentLocation.assets = data;
        this.changeDetectorRef.detectChanges();
      })
    );

    super.ngOnInit();
    this.getAssetsBySelectedLocation();
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
      this.getAssetsBySelectedLocation();
    } else {
      this.changeLocation.emit(this.rootLocation);
    }
    this.isDownloading = false;
  }

  selectLocation(location, emit) {
    this.currentLocation = location;
    this.getAssetsBySelectedLocation();
    if (emit) {
      this.changeLocation.emit(location);
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

  public clickOnAsset(asset: IAsset) {
    this.assetClicked.emit(asset);
    if (!this.assetPicker) {
      this.router.navigateByUrl(`${this.assetUrl}${asset.id}`);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
