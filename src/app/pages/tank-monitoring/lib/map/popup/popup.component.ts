import { Router } from '@angular/router';
import { MapPopupComponent } from 'projects/ngx-proximus/src/lib/map/popup/popup.component';
import { Subscription } from 'rxjs';
import { Component, Input, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ITankMonitoringAsset } from 'src/app/models/tankmonitoring/asset.model';
import { TankMonitoringAssetService } from 'src/app/services/tankmonitoring/asset.service';
import { ILocation } from 'src/app/models/g-location.model';

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

