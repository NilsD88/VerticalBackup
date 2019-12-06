import { Subscription } from 'rxjs';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ITankMonitoringAsset } from 'src/app/models/tankmonitoring/asset.model';
import { TankMonitoringAssetService } from 'src/app/services/tankmonitoring/asset.service';
import { ILocation } from 'src/app/models/g-location.model';

@Component({
  selector: 'pvf-tankmonitoring-map-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class TankMonitoringMapPopupComponent implements OnInit, OnDestroy {
  @Input() asset: ITankMonitoringAsset;
  
  private subscription: Subscription;

  constructor(
    private tankMonitoringAssetService: TankMonitoringAssetService
  ) {}

  ngOnInit() {
    if (this.asset) {
      this.subscription = this.tankMonitoringAssetService.getAssetPopupDetail(this.asset.id).subscribe((asset: ITankMonitoringAsset) => {
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
}

