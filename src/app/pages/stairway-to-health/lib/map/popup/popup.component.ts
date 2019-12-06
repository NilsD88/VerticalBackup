import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { IAsset } from 'src/app/models/g-asset.model';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';

@Component({
  selector: 'pvf-peoplecountingretail-map-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PeopleCountingRetailMapPopupComponent implements OnInit, OnDestroy {
  @Input() asset: IAsset;
  @Input() location: IPeopleCountingLocation;
  @Input() goToChild;

  private subscription: Subscription;

  constructor(
    private assetService: NewAssetService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.asset) {
      this.subscription = this.assetService.getAssetPopupDetail(this.asset.id).subscribe((asset: IAsset) => {
        this.asset = {
          ...this.asset,
          ...asset
        };
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openLocation() {
    if ((this.location.children || []).length) {
      this.goToChild(this.location);
    } else {
      this.router.navigateByUrl(`/private/stairwaytohealth/place/${this.location.id}`);
    }
  }
}

