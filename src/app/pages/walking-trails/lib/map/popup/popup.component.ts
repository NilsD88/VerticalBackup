import { SubSink } from 'subsink';
import { MapPopupComponent } from 'projects/ngx-proximus/src/lib/map/popup/popup.component';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { IAsset } from 'src/app/models/asset.model';
import { AssetService } from 'src/app/services/asset.service';

@Component({
  selector: 'pvf-walkingtrails-map-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class WalkingTrailsMapPopupComponent extends MapPopupComponent implements OnInit, OnDestroy {

  constructor(
    public assetService: AssetService,
    public router: Router,
    public elementRef: ElementRef
  ) {
    super(
      assetService,
      router,
      elementRef
    );
  }

  getAssetPopupDetail() {
    this.subs.add(
      this.assetService.getAssetPopupDetail(this.asset.id).subscribe((asset: IAsset) => {
        this.asset = {
          ...this.asset,
          ...asset
        };
      })
    );
  }

  openLocation() {
    if ((this.location.children || []).length) {
      this.goToChild(this.location);
    } else {
      this.router.navigateByUrl(`/private/walking-trails/trail/${this.location.id}`);
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}

