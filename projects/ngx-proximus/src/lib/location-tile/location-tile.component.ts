import { Subscription } from 'rxjs';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IAsset } from 'src/app/models/g-asset.model';

@Component({
  selector: 'pxs-location-tile',
  templateUrl: './location-tile.component.html',
  styleUrls: ['./location-tile.component.scss']
})
export class LocationTileComponent implements OnInit, OnDestroy {

  @Input() asset: IAsset;
  @Input() assetUrl: string;

  private subscription: Subscription;
  public imageIsLoading = true;

  constructor(
  ) { }

  ngOnInit() {
    /*
    this.subscription = this.assetService.getImageOfAssetById(this.asset.id).subscribe(image => {
      this.asset.image = image;
      this.imageIsLoading = false;
    });
    */
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
