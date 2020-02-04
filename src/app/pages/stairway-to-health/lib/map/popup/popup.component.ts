import { MapPopupComponent } from 'projects/ngx-proximus/src/lib/map/popup/popup.component';
import { Router } from '@angular/router';
import { Component, Input, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { AssetService } from 'src/app/services/asset.service';

@Component({
  selector: 'pvf-stairwaytohealth-map-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class StairwayToHealthMapPopupComponent extends MapPopupComponent implements OnInit, OnDestroy {

  constructor(
    public assetService: AssetService,
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

