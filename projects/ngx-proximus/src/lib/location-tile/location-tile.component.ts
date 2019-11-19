import { Subscription } from 'rxjs';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ILocation } from 'src/app/models/g-location.model';

@Component({
  selector: 'pxs-location-tile',
  templateUrl: './location-tile.component.html',
  styleUrls: ['./location-tile.component.scss']
})
export class LocationTileComponent implements OnInit, OnDestroy {

  @Input() location: ILocation;
  @Input() locationUrl: string;

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
