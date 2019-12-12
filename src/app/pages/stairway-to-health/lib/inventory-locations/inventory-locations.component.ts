import { WalkingTrailLocationService } from '../../../../services/walkingtrail/location.service';
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
export class PeopleCountingRetailInventoryLocationsComponent extends InventoryLocationsComponent implements OnInit {

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public locationService: WalkingTrailLocationService,
    public activatedRoute: ActivatedRoute,
  ) {
    super(
      changeDetectorRef,
      locationService,
      activatedRoute
    );
    this.leafUrl = 'private/stairwaytohealth/place/';
  }

  async ngOnInit() {
    super.ngOnInit();
  }
}