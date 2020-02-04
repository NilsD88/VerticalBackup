import { TankMonitoringLocationService } from 'src/app/services/tankmonitoring/location.service';
import { TankMonitoringAssetService } from 'src/app/services/tankmonitoring/asset.service';
import { InventoryComponent } from 'projects/ngx-proximus/src/lib/inventory/inventory.component';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ThresholdTemplateService } from 'src/app/services/threshold-templates';


@Component({
  templateUrl: './../../../../../../projects/ngx-proximus/src/lib/inventory/inventory.component.html',
  styleUrls: ['./../../../../../../projects/ngx-proximus/src/lib/inventory/inventory.component.scss']
})

export class TankMonitoringInventoryComponent extends InventoryComponent implements OnInit {

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public assetService: TankMonitoringAssetService,
    public thresholdTemplateService: ThresholdTemplateService,
    public locationService: TankMonitoringLocationService,
    public activatedRoute: ActivatedRoute,
  ) {
    super(
      changeDetectorRef,
      assetService,
      thresholdTemplateService,
      locationService,
      activatedRoute,
    );
    this.assetUrl = '/private/tankmonitoring/consumptions/';
  }

  async ngOnInit() {
    super.ngOnInit();
  }
}
