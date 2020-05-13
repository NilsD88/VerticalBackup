import {SharedService} from './../../../services/shared.service';
import {SmartCountingAssetService} from './../../../services/smart-counting/asset.service';
import {SmartCountingLocationService} from './../../../services/smart-counting/location.service';
import {findLocationById} from 'src/app/shared/utils';
import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {IPeopleCountingLocation} from 'src/app/models/peoplecounting/location.model';
import {IPeopleCountingAsset} from 'src/app/models/peoplecounting/asset.model';
import * as randomColor from 'randomcolor';
import { isNullOrUndefined } from 'util';
import { IField } from 'src/app/models/field.model';

@Component({
  selector: 'pvf-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss']
})
export class PlaceComponent implements OnInit {

  public leaf: IPeopleCountingLocation;
  public lastMonthLeafData: IPeopleCountingLocation;
  public parentLocation: IPeopleCountingLocation;
  public assets: IPeopleCountingAsset[];
  public assetUrl = '/private/smart-counting/detail/';
  public assetColors: string[];
  public locale: string;
  public fields: IField[];

  constructor(
    public locationService: SmartCountingLocationService,
    public assetService: SmartCountingAssetService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router
  ) {
  }

  ngOnInit() {

    this.activatedRoute.params.subscribe(async (params) => {
      try {
        this.leaf = await this.locationService.getLocationByIdWithoutParent(params.id).toPromise();
        this.fields = await this.locationService.getCustomFields().toPromise();
        if (isNullOrUndefined(this.leaf)) {
          throw {
            message: '404'
          };
        }
      } catch (error) {
        console.error(error);
        if (error.message.indexOf('404') !== -1) {
          await this.router.navigate(['/error/404']);
        }
      }
      this.assetColors = randomColor({
        count: this.leaf.assets.length
      });
      try {
        this.assets = await this.assetService.getAssetsByLocationId(this.leaf.id).toPromise();
      } catch (error) {
        if (error.message.indexOf('404') !== -1) {
          await this.router.navigate(['/error/404']);
        }
      }
      this.leaf.assets = this.assets;
      let rootLocation: IPeopleCountingLocation;
      if (this.sharedService.user.hasRole('pxs:iot:location_admin')) {
        rootLocation = (await this.locationService.getLocationsTree().toPromise())[0];
      } else {
        rootLocation = {
          id: null,
          parentId: null,
          geolocation: null,
          image: null,
          name: 'Locations',
          description: null,
          children: await this.locationService.getLocationsTree().toPromise()
        };
      }
      if (this.leaf.parent) {
        try {
          const parentLocation = findLocationById(rootLocation, this.leaf.parent.id).location;
          this.parentLocation = parentLocation;
        } catch (error) {
          if (error.message.indexOf('404') !== -1) {
            await this.router.navigate(['/error/404']);
          }
        }
      } else {
        this.parentLocation = rootLocation;
      }
      this.leaf.parent = this.parentLocation;
    });
  }
}
