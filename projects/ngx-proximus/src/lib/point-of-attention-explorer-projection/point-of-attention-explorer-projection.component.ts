import { PointOfAttentionService } from 'src/app/services/point-of-attention.service';
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
import { IPointOfAttention } from 'src/app/models/point-of-attention.model';

const pointOfAttentionUrl = 'private/smartmonitoring/points-of-attention/point-of-attention/';

@Component({
  selector: 'pxs-point-of-attention-explorer-projection',
  templateUrl: '../location-explorer/location-explorer.component.html',
  styleUrls: ['../location-explorer/location-explorer.component.scss']
})
export class PointOfAttentionExplorerProjectionComponent extends LocationExplorerComponent implements OnInit, OnDestroy {

  @Input() customAssetService;

  @Output() pointOfAttentionClicked: EventEmitter<IPointOfAttention> = new EventEmitter<IPointOfAttention>();

  public selectedAsset: IAsset;
  public loadingPointsOfAttention = false;

  private pointsOfAttentionRequestSource = new Subject();



  constructor(
    protected pointOfAttentionService: PointOfAttentionService,
    protected assetService: AssetService,
    protected locationService: LocationService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected dialog: MatDialog,
    protected router: Router,
  ) {
    super(
      locationService,
      assetService,
      changeDetectorRef,
      dialog,
      router,
    );
  }

  ngOnInit() {
    const pointsOfAttentionRequestSourcePipe = this.pointsOfAttentionRequestSource.pipe(
      switchMap(req => {
        if (req === 'STOP') {
          return of(this.currentLocation.pointsOfAttention);
        } else {
          return this.pointOfAttentionService.getPointOfAttentionByLocationId(this.currentLocation.id);
        }
      })
    );

    pointsOfAttentionRequestSourcePipe.subscribe((data: IPointOfAttention[]) => {
      this.loadingPointsOfAttention = false;
      this.currentLocation.pointsOfAttention = data;
    });

    super.ngOnInit();
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
      this.getPointsOfAttentionBySelectedLocation();
    } else {
      this.changeLocation.emit(this.rootLocation);
    }
    this.isDownloading = false;
  }

  selectLocation(location, emit) {
    this.currentLocation = location;
    this.getPointsOfAttentionBySelectedLocation();
    if (emit) {
      this.changeLocation.emit(location);
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

  public clickOnPointOfAttention(pointOfAttention: IPointOfAttention) {
    this.pointOfAttentionClicked.emit(pointOfAttention);
    this.router.navigateByUrl(`${pointOfAttentionUrl}${pointOfAttention.id}`);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
