import { TankMonitoringAssetService } from 'src/app/services/tankmonitoring/asset.service';
import { InventoryComponent } from 'projects/ngx-proximus/src/lib/inventory/inventory.component';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { NewThresholdTemplateService } from 'src/app/services/new-threshold-templates';
import { NewLocationService } from 'src/app/services/new-location.service';


@Component({
  templateUrl: './../../../../../../projects/ngx-proximus/src/lib/inventory/inventory.component.html',
  styleUrls: ['./../../../../../../projects/ngx-proximus/src/lib/inventory/inventory.component.scss']
})

export class TankMonitoringInventoryComponent extends InventoryComponent implements OnInit {

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public assetService: NewAssetService, // TankMonitoringAssetService
    public newThresholdTemplateService: NewThresholdTemplateService,
    public newLocationService: NewLocationService,
    public activatedRoute: ActivatedRoute,
  ) {
    super(
      changeDetectorRef,
      assetService,
      newThresholdTemplateService,
      newLocationService,
      activatedRoute,
    );
    this.assetUrl = '/private/tankmonitoring/consumptions/';
  }

  async ngOnInit() {
    super.ngOnInit();
  }
}
