import {Component, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { IAsset } from 'src/app/models/g-asset.model';
import { Subject } from 'rxjs';
import { findItemsWithTermOnKey } from 'src/app/shared/utils';

@Component({
  selector: 'pvf-manage-assets-list',
  templateUrl: './manage-assets-list.component.html',
  styleUrls: ['./manage-assets-list.component.scss']
})
export class ManageAssetsListComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  public assets: IAsset[] = [];
  public isLoading = false;

  public dataSource: MatTableDataSource<IAsset>;
  public displayedColumns: string[] = ['name', 'location.name', 'thresholdTemplate.name', 'actions'];
  public filter = {
    name: '',
  };

  public easterEgg = false;

  constructor(
    public newAssetService: NewAssetService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  public async ngOnInit() {
    this.getAssets();
  }


  private async getAssets() {
    this.isLoading = true;
    this.assets = await this.newAssetService.getAssets().toPromise();
    this.isLoading = false;
    this.updateDataSourceWithAssets(this.assets);
  }

  private updateDataSourceWithAssets(assets: IAsset[]) {
    this.dataSource = new MatTableDataSource(assets);
    this.dataSource.sortingDataAccessor = (asset, property) => {
        if (property.includes('.')) {
          return property.split('.')
            .reduce((object, key) => object[key], asset);
        }
        return asset[property].toLocaleLowerCase();
    };
    this.dataSource.sort = this.sort;
  }

  public filterByName() {
    if (this.filter.name.toUpperCase() === 'PROXIMUS') {
      this.easterEgg = true;
    } else {
      const assetsFiltered = findItemsWithTermOnKey(this.filter.name, this.assets, 'name');
      this.updateDataSourceWithAssets(assetsFiltered);
    }
  }

  public async deleteAsset(id: string) {
    this.newAssetService.deleteAsset(id).subscribe((result) => {
      this.assets = null;
      this.changeDetectorRef.detectChanges();
      this.getAssets();
    });
  }
}
