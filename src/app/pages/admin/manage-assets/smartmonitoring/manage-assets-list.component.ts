import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Asset} from '../../../../models/asset.model';
import {AssetService} from '../../../../services/asset.service';
import { MatPaginator } from '@angular/material';
import { merge } from 'rxjs/internal/observable/merge';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'pvf-manage-assets-list',
  templateUrl: './manage-assets-list.component.html',
  styleUrls: ['./manage-assets-list.component.scss']
})
export class ManageAssetsListComponent implements OnInit {
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator; 
  
  public assets: Asset[] = [];
  public page = 0;
  public totalItems = 0;
  public pagesize = 10;
  public pageSizeOptions = [5, 10, 25, 100, 500, 1000];
  public isLoading: boolean = false;

  
  public dataSource:MatTableDataSource<Asset>;
  public displayedColumns: string[] = ['name', 'sublocation.location.locationType.name', 'sublocation.location.name', 'sublocation.name', 'thresholdTemplate.name', 'actions'];
  public filter = {
    name: '',
    thresholdTemplates: [],
    locationType: null,
    locations: [],
    statuses: []
  };



  constructor(public assetService: AssetService) {
  }

  public async ngOnInit() {
    await this.getAssetsByFilter();

    this.sort.sortChange.subscribe(() => { 
      this.getAssetsByFilter();
    });

  }


  public async pageChanged(evt) {
    this.page = evt.pageIndex;
    this.pagesize = evt.pageSize;
    await this.getAssetsByFilter();
  }

  private async getAssetsByFilter() {
    this.isLoading = true;
    this.assets = [];
    const pagedAssets = await this.assetService.getPagedAssets(this.filter, this.page, this.pagesize, this.sort.active, this.sort.direction);
    this.assets = pagedAssets.data;
    this.totalItems = pagedAssets.totalElements;
    this.isLoading = false;

    this.dataSource = new MatTableDataSource(this.assets);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (asset, property) => {
        if (property.includes('.')) {
          return property.split('.')
            .reduce((object, key) => object[key], asset);
        }
        return asset[property].toLocaleLowerCase();
    };
    this.dataSource.sort = this.sort;
  }

  public filterNameChange(evt) {
    this.getAssetsByFilter();
  }

  public async deleteAsset(asset: Asset) {
    await this.assetService.deleteAsset(asset.id);
    this.getAssetsByFilter();
  }

}
