import { PeopleCountingLocationService } from './../../../../../src/app/services/peoplecounting/location.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';

@Component({
  selector: 'pxs-location-tile',
  templateUrl: './location-tile.component.html',
  styleUrls: ['./location-tile.component.scss']
})
export class LocationTileComponent implements OnInit, OnDestroy {

  @Input() location: IPeopleCountingLocation;
  @Input() locationUrl: string;

  private subscriptions: Subscription[] = [];
  public coverIsLoading = true;
  public floorPlanIsLoading = true;

  constructor(
    private locationService: PeopleCountingLocationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.locationService.getImageOfLocationById(this.location.id).subscribe(image => {
        this.location.image = image;
        this.floorPlanIsLoading = false;
      })
    );
    this.subscriptions.push(
      this.locationService.getCoverOfLocationById(this.location.id).subscribe(images => {
        this.location.images = images;
        this.coverIsLoading = false;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  openLocation() {
    this.router.navigateByUrl(`${this.locationUrl}${this.location.id}`);
  }

}
