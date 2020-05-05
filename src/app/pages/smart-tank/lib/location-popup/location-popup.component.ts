import { SharedService } from './../../../../services/shared.service';
import { SmartTankAssetService } from './../../../../services/smart-tank/asset.service';
import { SmartTankLocationService } from './../../../../services/smart-tank/location.service';
import { Component, OnInit, Optional, Inject, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { LocationPopupComponent } from 'projects/ngx-proximus/src/lib/location-popup/location-popup.component';

@Component({
  selector: 'pvf-smarttank-location-popup',
  templateUrl: './../../../../../../projects/ngx-proximus/src/lib/location-popup/location-popup.component.html',
  styleUrls: ['./../../../../../../projects/ngx-proximus/src/lib/location-popup/location-popup.component.scss']
})
export class SmartTankLocationPopupComponent extends LocationPopupComponent implements OnInit, OnDestroy {
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    public locationService: SmartTankLocationService,
    public assetService: SmartTankAssetService,
    protected sharedService: SharedService,
  ) {
    super(
      data,
      dialogRef,
      locationService,
      assetService,
      sharedService
    );
    this.assetUrl = '/private/smart-tank/consumptions/';
   }
}
