import { MapPopupComponent } from 'projects/ngx-proximus/src/lib/map/popup/popup.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, Input, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { IAsset } from 'src/app/models/g-asset.model';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';

@Component({
  selector: 'pvf-peoplecountingretail-map-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PeopleCountingRetailMapPopupComponent extends MapPopupComponent implements OnInit, OnDestroy {

  constructor(
    public assetService: NewAssetService,
    public router: Router,
    public elementRef: ElementRef
  ) {
    super(
      assetService,
      router,
      elementRef
    );
  }

  openLocation() {
    if ((this.location.children || []).length) {
      this.goToChild(this.location);
    } else {
      this.router.navigateByUrl(`/private/stairwaytohealth/place/${this.location.id}`);
    }
  }
}

