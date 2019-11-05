import { Subscription } from 'rxjs';
import { NewAssetService } from './../../../../../../src/app/services/new-asset.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ILocation } from 'src/app/models/g-location.model';
import { IAlert } from 'src/app/models/g-alert.model';
import { IAsset } from 'src/app/models/g-asset.model';

@Component({
  selector: 'pxs-map-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class MapPopupComponent implements OnInit, OnDestroy {
  @Input() asset: IAsset;
  @Input() assetUrl: string;
  @Input() location: ILocation;
  @Input() goToChild;

  public lastAlert: IAlert;
  private subscription: Subscription;

  constructor(private assetService: NewAssetService) {}

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

