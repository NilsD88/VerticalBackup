import { SharedService } from './../../../../services/shared.service';
import { WalkingTrailsLocationService } from './../../../../services/walking-trails/location.service';
import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventoryLocationsComponent } from '../../../../../../projects/ngx-proximus/src/lib/inventory-locations/inventory-locations.component';

export interface IInventoryFilterBE {
  locationName?: string;
}

@Component({
  templateUrl: './../../../../../../projects/ngx-proximus/src/lib/inventory-locations/inventory-locations.component.html',
  styleUrls: ['./../../../../../../projects/ngx-proximus/src/lib/inventory-locations/inventory-locations.component.scss']
})
export class WalkingTrailsInventoryLocationsComponent extends InventoryLocationsComponent implements OnInit {

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public locationService: WalkingTrailsLocationService,
    public activatedRoute: ActivatedRoute,
    protected sharedService: SharedService
  ) {
    super(
      changeDetectorRef,
      locationService,
      activatedRoute,
      sharedService
    );
    this.leafUrl = 'private/walking-trails/trail';
    this.locationPlaceholderName = 'FILTERS.TRAIL_NAME';
  }

  async ngOnInit() {
    super.ngOnInit();
  }
}
