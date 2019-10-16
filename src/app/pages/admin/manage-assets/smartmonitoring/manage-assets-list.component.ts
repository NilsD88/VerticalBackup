import {Component, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { IAsset } from 'src/app/models/g-asset.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'pvf-manage-assets-list',
  templateUrl: './manage-assets-list.component.html',
  styleUrls: ['./manage-assets-list.component.scss']
})
export class ManageAssetsListComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public assets: IAsset[] = [];
  public page = 0;
  public totalElements = 0;
  public pageSize = 10;
  public pageSizeOptions = [5, 10, 25, 100, 500, 1000];
  public isLoading = false;

  public dataSource: MatTableDataSource<IAsset>;
  public displayedColumns: string[] = ['name', 'location.name', 'thresholdTemplate.name', 'actions'];
  public filter = {
    name: '',
  };

  public easterEgg = false;

  public searchFilter$ = new Subject<any>();


  constructor(
    public newAssetService: NewAssetService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  public async ngOnInit() {
    await this.getAssetsByFilter();

    // TODO: search filter for asset with new backend
    /*
    this.newAssetService.searchPagedAssetsWithFilter(this.searchFilter$).subscribe(pagedAssets => {
      this.assets = pagedAssets.data;
      this.totalItems = pagedAssets.totalElements;
      this.isLoading = false;
      this.updateDataSource();
    });
    */

    this.sort.sortChange.subscribe(() => {
      this.getAssetsByFilter();
    });

  }

  public async pageChanged(evt) {
    this.page = evt.pageIndex;
    this.pageSize = evt.pageSize;
    await this.getAssetsByFilter();
  }

  private async getAssetsByFilter() {
    this.isLoading = true;
    this.assets = [];
    // const pagedAssets = await this.newAssetService.getPagedAssets(this.filter);
    // TODO: get pagedAssets when backend will be updated
    const pagedAssets = await this.newAssetService.getPagedAssets(this.page, this.pageSize).toPromise();
    console.log(pagedAssets);
    this.assets = await pagedAssets.assets;
    this.totalElements = pagedAssets.totalElements;
    this.isLoading = false;
    this.updateDataSource();
  }

  private updateDataSource() {
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

  public async deleteAsset(id: string) {
    this.newAssetService.deleteAsset(id).subscribe((result) => {
      this.assets = null;
      this.changeDetectorRef.detectChanges();
      this.getAssetsByFilter();
    });
  }

  public onFilterChange() {
    if (this.filter.name.toUpperCase() === 'PROXIMUS') {
      this.easterEgg = true;
    }
    this.isLoading = true;
    this.searchFilter$.next({...this.filter});
  }

}
