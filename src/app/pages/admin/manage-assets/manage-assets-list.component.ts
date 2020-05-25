import { IThing } from 'src/app/models/thing.model';
import { SubSink } from 'subsink';
import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { AssetService } from 'src/app/services/asset.service';
import { IAsset } from 'src/app/models/asset.model';
import { findItemsWithTermOnKey } from 'src/app/shared/utils';
import { MatPaginator, MatDialog } from '@angular/material';
import { PopupConfirmationComponent } from 'projects/ngx-proximus/src/lib/popup-confirmation/popup-confirmation.component';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'pvf-manage-assets-list',
  templateUrl: './manage-assets-list.component.html',
  styleUrls: ['./manage-assets-list.component.scss']
})
export class ManageAssetsListComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  public assets: IAsset[] = [];
  public isLoading = false;

  public dataSource: MatTableDataSource<IAsset>;
  public displayedColumns: string[] = ['name', 'location.name', 'thresholdTemplate.name', 'overwriteGPS' , 'things', 'actions'];
  public filter = {
    name: '',
  };

  public easterEgg = false;
  private subs = new SubSink();

  constructor(
    public assetService: AssetService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    public sharedService: SharedService
  ) {}

  public async ngOnInit() {
    this.getAssets();
  }

  private async getAssets() {
    this.isLoading = true;
    this.assets = await this.assetService.getAssets().toPromise();
    this.isLoading = false;
    this.updateDataSourceWithAssets(this.assets);
  }

  private updateDataSourceWithAssets(assets: IAsset[]) {
    this.dataSource = new MatTableDataSource(assets);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (asset, property) => {
        if (property.includes('.')) {
          return property.split('.').reduce((object, key) => {
            if (object && object[key]) {
              return object[key];
            } else {
              return null;
            }
          }, asset);
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
    this.dialog.open(PopupConfirmationComponent, {
      data: {
        title: `Warning`,
        content: 'Are you sure you want to delete? It will not be accessible anymore.'
      },
      minWidth: '320px',
      maxWidth: '400px',
      width: '100vw',
      maxHeight: '80vh',
    }).afterClosed().subscribe(
      result => {
        if (result) {
          this.subs.sink = this.assetService.deleteAsset(id).subscribe(
            () => {
              this.assets = null;
              this.changeDetectorRef.detectChanges();
              this.getAssets();
            });
        }
      }
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
