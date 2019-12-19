import { Router } from '@angular/router';
import { MapPopupComponent } from 'projects/ngx-proximus/src/lib/map/popup/popup.component';
import { Component, Input, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { TankMonitoringAssetService } from 'src/app/services/tankmonitoring/asset.service';

@Component({
  selector: 'pvf-tankmonitoring-map-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class TankMonitoringMapPopupComponent extends MapPopupComponent implements OnInit, OnDestroy {

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
}

