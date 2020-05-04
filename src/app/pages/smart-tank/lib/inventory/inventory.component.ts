import { SharedService } from './../../../../services/shared.service';
import { SmartTankLocationService } from 'src/app/services/smart-tank/location.service';
import { SmartTankAssetService } from 'src/app/services/smart-tank/asset.service';
import { InventoryComponent } from 'projects/ngx-proximus/src/lib/inventory/inventory.component';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ThresholdTemplateService } from 'src/app/services/threshold-templates';


@Component({
  templateUrl: './../../../../../../projects/ngx-proximus/src/lib/inventory/inventory.component.html',
  styleUrls: ['./../../../../../../projects/ngx-proximus/src/lib/inventory/inventory.component.scss']
})

export class SmartTankInventoryComponent extends InventoryComponent implements OnInit {

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public assetService: SmartTankAssetService,
    public thresholdTemplateService: ThresholdTemplateService,
    public locationService: SmartTankLocationService,
    public activatedRoute: ActivatedRoute,
    protected sharedService: SharedService,
  ) {
    super(
      changeDetectorRef,
      assetService,
      thresholdTemplateService,
      locationService,
      activatedRoute,
      sharedService
    );
    this.assetUrl = '/private/smart-tank/consumptions/';
  }

  async ngOnInit() {
    super.ngOnInit();
  }
}
