import {Component, OnInit} from '@angular/core';
import {Asset} from '../../../../models/asset.model';
import {AssetService} from '../../../../services/asset.service';

@Component({
  selector: 'pvf-manage-assets-list',
  templateUrl: './manage-assets-list.component.html',
  styleUrls: ['./manage-assets-list.component.scss']
})
export class ManageAssetsListComponent implements OnInit {
  public assets: Asset[] = [];
  public filter = {
    name: '',
    thresholdTemplates: [],
    locationType: null,
    locations: [],
    statuses: []
  };
  public page = 0;
  public totalItems = 0;
  public pagesize = 10;
  public pageSizeOptions = [5, 10, 25, 100, 500, 1000];

  constructor(private assetService: AssetService) {
  }

  public async ngOnInit() {
    await this.getAssetsByFilter();
  }

  public async pageChanged(evt) {
    this.page = evt.pageIndex;
    this.pagesize = evt.pageSize;
    await this.getAssetsByFilter();
  }

  private async getAssetsByFilter() {
    this.assets = [];
    const pagedAssets = await this.assetService.getPagedAssets(this.filter, this.page, this.pagesize);
    this.assets = pagedAssets.assets;
    this.totalItems = pagedAssets.totalElements;
  }

  public filterNameChange(evt) {
    this.getAssetsByFilter();
  }

  public async deleteAsset(asset: Asset) {
    await this.assetService.deleteAsset(asset.id);
    this.getAssetsByFilter();
  }

}
