import { ISmartTankAsset } from './../../../../../models/smart-tank/asset.model';
import { Router } from '@angular/router';
import { MapPopupComponent } from 'projects/ngx-proximus/src/lib/map/popup/popup.component';
import { Component, OnInit, OnDestroy, ElementRef, Input } from '@angular/core';
import { SmartTankAssetService } from 'src/app/services/smart-tank/asset.service';

@Component({
  selector: 'pvf-smarttank-map-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class SmartTankMapPopupComponent extends MapPopupComponent implements OnInit, OnDestroy {

  @Input() asset: ISmartTankAsset;
  public fullLocationName = '';

  constructor(
    public smartTankAssetService: SmartTankAssetService,
    public router: Router,
    public elementRef: ElementRef

  ) {
    super(
      smartTankAssetService,
      router,
      elementRef
    );
  }

  getAssetPopupDetail() {
    this.subs.add(
      this.assetService.getAssetPopupDetail(this.asset.id).subscribe((asset: ISmartTankAsset) => {
        this.asset.image = asset.image;
        this.asset.lastRefill = asset.lastRefill;
        this.asset.description = asset.description;
      })
    );
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.asset) {
      let location = this.asset.location;
      this.fullLocationName += (location || {}).name;
      location = (location || {}).parent;
      while ((location || {}).id) {
        this.fullLocationName += ' > ' + location.name;
        location = location.parent;
      }
    }
  }
}

