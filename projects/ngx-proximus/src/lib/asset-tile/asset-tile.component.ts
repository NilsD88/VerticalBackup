import { Subscription } from 'rxjs';
import { NewAssetService } from './../../../../../src/app/services/new-asset.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IAsset } from 'src/app/models/g-asset.model';

@Component({
  selector: 'pxs-asset-tile',
  templateUrl: './asset-tile.component.html',
  styleUrls: ['./asset-tile.component.scss']
})
export class AssetTileComponent implements OnInit, OnDestroy {

  @Input() asset: IAsset;
  @Input() assetUrl: string;

  private subscription: Subscription;

  constructor(
    private assetService: NewAssetService
  ) { }

  ngOnInit() {
    this.subscription = this.assetService.getImageOfAssetById(this.asset.id).subscribe(image => {
      this.asset.image = image;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
