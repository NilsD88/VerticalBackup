import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {AssetService} from '../../../../services/asset.service';
import {Asset} from '../../../../models/asset.model';
import {Thing} from '../../../../models/thing.model';
import {ThingService} from '../../../../services/thing.service';

@Component({
  selector: 'pvf-manage-assets',
  templateUrl: './manage-assets.component.html',
  styleUrls: ['./manage-assets.component.scss']
})
export class ManageAssetsComponent implements OnInit {
  public asset: Asset;
  public thingsList: Thing[] = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private assetService: AssetService,
    private thingService: ThingService) {
  }

  async ngOnInit() {
    const id = await this.getRouteId();
    this.getThingsList();
    const assetPromise = this.assetService.getAssetById(id);
    this.asset = await assetPromise;
  }

  private getRouteId(): Promise<string | number> {
    return new Promise((resolve, reject) => {
      this.activeRoute.params.subscribe((params) => {
        if (!isNullOrUndefined(params.id)) {
          resolve(params.id);
        } else {
          reject('ManageAssetComponent: No \'id\' parameter in route.');
        }
      }, reject);
    });
  }

  public getThingsList() {
    this.thingService.getAll()
      .then((result) => {
        this.thingsList = result;
      });
  }

  public thingsListChanged(evt) {
    this.asset.things = evt;
  }
}
