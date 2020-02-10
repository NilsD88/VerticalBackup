import { SharedService } from './../../../../services/shared.service';
import { TankMonitoringAssetService } from './../../../../services/tankmonitoring/asset.service';
import { TankMonitoringLocationService } from './../../../../services/tankmonitoring/location.service';
import { Component, OnInit, Optional, Inject, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { LocationPopupComponent } from 'projects/ngx-proximus/src/lib/location-popup/location-popup.component';

@Component({
  selector: 'pvf-tankmonitoring-location-popup',
  templateUrl: './../../../../../../projects/ngx-proximus/src/lib/location-popup/location-popup.component.html',
  styleUrls: ['./../../../../../../projects/ngx-proximus/src/lib/location-popup/location-popup.component.scss']
})
export class TankMonitoringLocationPopupComponent extends LocationPopupComponent implements OnInit, OnDestroy {
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    public locationService: TankMonitoringLocationService,
    public assetService: TankMonitoringAssetService,
    protected sharedService: SharedService,
  ) {
    super(
      data,
      dialogRef,
      locationService,
      assetService,
      sharedService
    );
    this.assetUrl = '/private/tankmonitoring/consumptions/';
   }
}
