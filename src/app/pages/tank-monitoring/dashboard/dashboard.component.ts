import { IAsset } from 'src/app/models/g-asset.model';
import {Component, OnInit, ViewChild} from '@angular/core';
import {Asset, TankStatus} from '../../../models/asset.model';
import {AssetService} from '../../../services/asset.service';
import {TranslateService} from '@ngx-translate/core';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { Subject } from 'rxjs/internal/Subject';
import { MatPaginator } from '@angular/material';

const statuses = ['EMPTY', 'LOW', 'OK'];


@Component({
  selector: 'pvf-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public assets: IAsset[] = [];
  public pageSizeOptions = [2, 5, 10, 25, 100, 500, 1000];

  public dataSource;
  public chartData: any[];
  public isLoading = true;

  public filter = {
    name: '',
    status: [],
    batteryLevel: {
      min: 0,
      max: 100
    },
    fuelLevel: {
      min: 0,
      max: 100
    }
  };

  public page = 0;
  public pageSize = 2;
  public totalItems = 0;

  public searchFilter$ = new Subject<any>();

  public chartColors = [
    'rgba(204, 0, 0, 0.7)',
    'rgba(255, 204, 51, 1)',
    'rgba(102, 204, 0, 0.7)',
  ];


  displayedColumns: string[] = ['name', 'location.name', 'status'];

  constructor(
    private assetService: AssetService,
    private translateService: TranslateService,
    private newAssetService: NewAssetService,
  ) {}

  ngOnInit() {
    this.filter.status = statuses;

    this.newAssetService.searchAssetsWithFilter(this.searchFilter$).subscribe((assets: IAsset[]) => {
      this.page = 0;
      this.totalItems = assets.length;
      this.assets = assets;
      this.isLoading = false;
      this.updateDataSource();
      this.createChartData();
      console.log({...this.assets});
    });

    this.onFilterChange();
  }



  public updateDataSource() {
    const assets: IAsset[] = [];
    for (const asset of this.assets) {
      if (this.filter.status.some((value) => value === asset.test)) {
        assets.push(asset);
      }
    }

    this.dataSource = new MatTableDataSource(assets);
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

  public async createChartData() {
    const chartData = [];
    for (const status of statuses) {
      chartData.push({
        name: await this.translateService.get('DASHBOARD.TANK_MONITORING.STATUS.' + status).toPromise(),
        keyName: status,
        y: this.assets.filter((asset: IAsset) => {
          console.log(asset);
          return asset.test === status;
        }).length
      });
      this.chartData = chartData;
    }
  }

  public updateBatteryLevelFilter(event: [number, number]): void {
    this.filter.batteryLevel.min = event[0];
    this.filter.batteryLevel.max = event[1];
    this.onFilterChange();
    this.searchFilter$.next({...this.filter});
  }

  public updateFuelLevelFilter(event: [number, number]): void {
    this.filter.fuelLevel.min = event[0];
    this.filter.fuelLevel.max = event[1];
    this.onFilterChange();
    this.searchFilter$.next({...this.filter});
  }

  public onFilterChange() {
    this.page = 0;
    this.totalItems = 0;
    this.assets = [];
    this.isLoading = true;
    this.searchFilter$.next({...this.filter});
  }

  public pieClicked(keyNames: string[]) {
    this.filter.status = keyNames;
    this.updateDataSource();
    this.createChartData();
  }

  public async pageChanged(evt) {
    this.page = evt.pageIndex;
    this.pageSize = evt.pageIndex;
    this.assets = [];
    this.isLoading = true;
    this.searchFilter$.next({...this.filter});
  }

}
