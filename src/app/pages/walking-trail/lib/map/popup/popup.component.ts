import { IWalkingTrailLocation } from './../../../../../models/walkingtrail/location.model';
import { Subscription } from 'rxjs';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { IAsset } from 'src/app/models/g-asset.model';
import { NewAssetService } from 'src/app/services/new-asset.service';

@Component({
  selector: 'pvf-walkingtrail-map-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class WalkingTrailMapPopupComponent implements OnInit, OnDestroy {
  @Input() asset: IAsset;
  @Input() location: IWalkingTrailLocation;
  @Input() goToChild;

  private subscription: Subscription;

  constructor(
    private assetService: NewAssetService
  ) {}

  ngOnInit() {
    if (this.asset) {
      this.subscription = this.assetService.getAssetPopupDetail(this.asset.id).subscribe((asset: IAsset) => {
        this.asset = {
          ...this.asset,
          ...asset
        };
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openLocation() {
    this.goToChild(this.location);
  }
}

