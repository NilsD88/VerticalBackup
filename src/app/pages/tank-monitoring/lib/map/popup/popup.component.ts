import { ITankMonitoringAsset } from './../../../../../models/tankmonitoring/asset.model';
import { Router } from '@angular/router';
import { MapPopupComponent } from 'projects/ngx-proximus/src/lib/map/popup/popup.component';
import { Component, OnInit, OnDestroy, ElementRef, Input } from '@angular/core';
import { TankMonitoringAssetService } from 'src/app/services/tankmonitoring/asset.service';

@Component({
  selector: 'pvf-tankmonitoring-map-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class TankMonitoringMapPopupComponent extends MapPopupComponent implements OnInit, OnDestroy {

  @Input() asset: ITankMonitoringAsset;
  public fullLocationName = '';

  constructor(
    public tankMonitoringAssetService: TankMonitoringAssetService,
    public router: Router,
    public elementRef: ElementRef

  ) {
    super(
      tankMonitoringAssetService,
      router,
      elementRef
    );
  }

  getAssetPopupDetail() {
    this.subs.add(
      this.assetService.getAssetPopupDetail(this.asset.id).subscribe((asset: ITankMonitoringAsset) => {
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

