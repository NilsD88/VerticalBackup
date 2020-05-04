import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WalkingTrailsLocationService } from 'src/app/services/walking-trails/location.service';

@Component({
  selector: 'pvf-trail-images',
  templateUrl: './trail-images.component.html',
  styleUrls: ['./trail-images.component.scss']
})
export class TrailImagesComponent implements OnChanges {

  @Input() leaf: IPeopleCountingLocation;
  public imageSources: string[];

  constructor(
    private locationService: WalkingTrailsLocationService,
  ) { }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.leaf) {
      if (changes.leaf.currentValue && changes.leaf.currentValue !== changes.leaf.previousValue) {
        const location: IPeopleCountingLocation = await this.locationService.getImageCollectionById(changes.leaf.currentValue.id).toPromise();
        this.imageSources = location.images;
      }
    }
  }

}
