import {SharedService} from './../../../services/shared.service';
import {Stairway2HealthLocationService} from './../../../services/stairway-2-health/location.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {IPeopleCountingLocation} from 'src/app/models/peoplecounting/location.model';
import {IPeopleCountingAsset} from 'src/app/models/peoplecounting/asset.model';
import {Stairway2HealthAssetService} from 'src/app/services/stairway-2-health/asset.service';
import { isNullOrUndefined } from 'util';
import { IField } from 'src/app/models/field.model';
import { generatePxsGradientColor } from 'src/app/shared/utils';

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
  public assetUrl = '/private/stairway-2-health/detail/';
  public assetColors: string[];
  public locale: string;
  public fields: IField[];

  constructor(
    public locationService: Stairway2HealthLocationService,
    public assetService: Stairway2HealthAssetService,
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
          if (error.message.indexOf('404') !== -1) {
            await this.router.navigate(['/error/404']);
          }
        }

        try {
          this.assets = await this.assetService.getAssetsByLocationId(this.leaf.id).toPromise();
          this.assetColors = generatePxsGradientColor(this.leaf.assets.length || 1);
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
      }
    );
  }
}
