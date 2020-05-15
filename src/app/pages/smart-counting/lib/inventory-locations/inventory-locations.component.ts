import { SharedService } from './../../../../services/shared.service';
import { SmartCountingLocationService } from './../../../../services/smart-counting/location.service';
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
export class SmartCountingInventoryLocationsComponent extends InventoryLocationsComponent implements OnInit {

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public locationService: SmartCountingLocationService,
    public activatedRoute: ActivatedRoute,
    protected sharedService: SharedService,
  ) {
    super(
      changeDetectorRef,
      locationService,
      activatedRoute,
      sharedService
    );
    this.leafUrl = 'private/smart-counting/place';
    this.locationPlaceholderName = 'FILTERS.PLACE_NAME';
  }

  async ngOnInit() {
    super.ngOnInit();
  }
}
