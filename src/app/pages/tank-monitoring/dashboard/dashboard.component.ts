import { IAsset } from 'src/app/models/g-asset.model';
import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { NewAssetService } from 'src/app/services/new-asset.service';

const statuses = ['EMPTY', 'LOW', 'OK'];

@Component({
  selector: 'pvf-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  public assets: IAsset[] = [];

  public dataSource;
  public chartData: any[];
  public isLoading = false;

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

  public chartColors = [
    'rgba(204, 0, 0, 0.7)',
    'rgba(255, 204, 51, 1)',
    'rgba(102, 204, 0, 0.7)',
  ];


  displayedColumns: string[] = ['name', 'location.name', 'status'];

  constructor(
    private translateService: TranslateService,
    private newAssetService: NewAssetService,
  ) {}

  async ngOnInit() {
    this.filter.status = statuses;
    this.isLoading = true;
    this.assets = await this.newAssetService.getAssets().toPromise();
    this.updateDataSource();
    this.createChartData();
    this.isLoading = false;
    /*
    this.newAssetService.searchAssetsWithFilter(this.searchFilter$).subscribe((assets: IAsset[]) => {
      this.page = 0;
      this.totalItems = assets.length;
      this.assets = assets;
      this.isLoading = false;
      this.updateDataSource();
      this.createChartData();
      console.log({...this.assets});
    });
    */

    this.onFilterChange();
  }


  public updateDataSourceWithFilteredAssets(assets: IAsset[]) {
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


  public updateDataSource() {
    const assets: IAsset[] = [];
    for (const asset of this.assets) {
      assets.push(asset);
      // TODO: filter on fuel and battery level
      /* if (this.filter.status.some((value) => value === asset.test)) {
        assets.push(asset);
      } */
    }
    this.updateDataSourceWithFilteredAssets(assets);
  }


  public async createChartData() {
    console.log('CREATE CHART DATA');
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
  }

  public updateFuelLevelFilter(event: [number, number]): void {
    this.filter.fuelLevel.min = event[0];
    this.filter.fuelLevel.max = event[1];
    this.onFilterChange();
  }

  public onFilterChange() {
    // SORT
  }

  public filterByName() {
    const term = this.filter.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    const assetsFiltered  = this.assets.filter((asset) => asset.name.toLocaleUpperCase().includes(term));
    this.updateDataSourceWithFilteredAssets(assetsFiltered);
  }

  public pieClicked(keyNames: string[]) {
    this.filter.status = keyNames;
    this.updateDataSource();
    this.createChartData();
  }

}
