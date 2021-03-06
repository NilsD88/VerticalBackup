import { AssetService } from '../../../../../src/app/services/asset.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IAsset } from 'src/app/models/asset.model';
import {SubSink} from 'subsink';

@Component({
  selector: 'pxs-asset-tile',
  templateUrl: './asset-tile.component.html',
  styleUrls: ['./asset-tile.component.scss']
})
export class AssetTileComponent implements OnInit, OnDestroy {

  @Input() asset: IAsset;
  @Input() assetUrl: string;

  private subs = new SubSink();
  public imageIsLoading = true;

  constructor(
    private assetService: AssetService
  ) { }

  ngOnInit() {
    this.subs.sink = this.assetService.getImageOfAssetById(this.asset.id).subscribe(image => {
      this.asset.image = image;
      this.imageIsLoading = false;
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
