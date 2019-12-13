import { TankMonitoringAssetService } from './../../../services/tankmonitoring/asset.service';
import { cloneDeep } from 'lodash';
import { ITankMonitoringAsset } from 'src/app/models/tankmonitoring/asset.model';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material';
import { Subject, Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ILocation } from 'src/app/models/g-location.model';
import { TankMonitoringLocationService } from 'src/app/services/tankmonitoring/location.service';

interface IRange {
  min: number;
  max: number;
}

interface IFilterFE {
  name: string;
  statuses: string[];
  fuelLevel: IRange;
  batteryLevel: IRange;
}

@Component({
  selector: 'pvf-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  public rootLocation: ILocation;
  public assets: ITankMonitoringAsset[] = [];
  public selectedAssets: ITankMonitoringAsset[];

  public dataSource;
  public chartData: any[];
  public isLoading = false;

  public filterFE: IFilterFE = {
    fuelLevel: {
      min: 0,
      max: 100
    },
    batteryLevel: {
      min: 0,
      max: 100
    },
    statuses: ['EMPTY', 'LOW', 'OK', 'UNKNOW'],
    name: '',
  };

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
    'rgba(100, 100, 100, 0.7)',
  ];

  displayedColumns: string[] = ['name', 'thing', 'location.name', 'fuel', 'battery', 'actions'];
  public filterFE$ = new Subject<IFilterFE>();

  constructor(
    private assetService: TankMonitoringAssetService,
    private locationService: TankMonitoringLocationService
  ) {}

  async ngOnInit() {
    this.isLoading = true;
    this.rootLocation = {
      id: null,
      parentId: null,
      geolocation: null,
      image: null,
      name: 'Locations',
      description: null,
      children: await this.locationService.getLocationsTree().toPromise()
    };
    this.assets = await this.assetService.getAssets().toPromise();
    this.assets.forEach((asset) => {
      if ((asset.things || []).length) {
        const VALUE = asset.things[0].sensors[0].value;
        if (VALUE) {
          if (VALUE < 10) {
            asset.status = 'EMPTY';
          } else if (VALUE < 20) {
            asset.status = 'LOW';
          } else {
            asset.status = 'OK';
          }
        } else {
          asset.status = 'UNKNOW';
        }
      } else {
        asset.status = 'UNKNOW';
      }
    });
    console.log(this.assets);
    this.updateDataSourceWithFilteredAssets(this.assets);
    this.isLoading = false;
    filteredAssetsObs(this.filterFE$).subscribe(() => { this.updateFilterdAssets(); });
    this.changeFilterFE();
  }

  private updateFilterdAssets() {
    const filteredAssets = cloneDeep(this.assets).filter((asset: ITankMonitoringAsset) => {
      let result = true;
      if (this.filterFE.name && result) {
        if (asset.name) {
          const TERM = this.filterFE.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
          result = asset.name.toLocaleUpperCase().includes(TERM);
        } else {
          result = false;
        }
      }

      if (this.filterFE.statuses.length && result) {
        result = this.filterFE.statuses.includes(asset.status);
      }

      if (this.filterFE.batteryLevel && result) {
        const {min, max} = this.filterFE.batteryLevel;
        const batteryLevel = asset.things[0].batteryPercentage;
        if (min === 0 && max === 100) {
          result = true;
        } else {
          if (batteryLevel >= min && batteryLevel <= max) {
            result = true;
          } else {
            result = false;
          }
        }
      }

      if (this.filterFE.fuelLevel && result) {
        const {min, max} = this.filterFE.fuelLevel;
        const fuelLevel = asset.things[0].sensors[0].value;
        if (min === 0 && max === 100) {
          result = true;
        } else {
          if (fuelLevel >= min && fuelLevel <= max) {
            result = true;
          } else {
            result = false;
          }
        }
      }

      return result;
    });
    this.updateDataSourceWithFilteredAssets(filteredAssets);
  }

  public updateDataSourceWithFilteredAssets(assets: ITankMonitoringAsset[]) {
    this.selectedAssets = assets;
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
        switch (property) {
          case 'fuel':
            return ((asset.things[0] || {}).sensors[0] || {}).value;
          case 'battery':
              return (asset.things[0] || {}).batteryPercentage;
          default:
            return asset[property].toLocaleLowerCase();
        }
    };
    this.dataSource.sort = this.sort;
    this.createChartData(assets);
  }


  public async createChartData(assets: ITankMonitoringAsset[]) {
    const chartData = [];
    const STATUS_ASSETS = {
      EMPTY: [],
      LOW: [],
      OK: [],
      UNKNOW: [],
    };

    assets.forEach((asset) => {
      STATUS_ASSETS[asset.status].push(asset);
    });

    for (const status in STATUS_ASSETS) {
      if (status) {
        chartData.push({
          name: status,
          keyName: status,
          y: STATUS_ASSETS[status].length
        });
      }
    }
    this.chartData = chartData;
  }


  public pieClicked(keyNames: string[]) {
    this.filterFE.statuses = keyNames;
    this.changeFilterFE();
  }

  public changeFilterFE() {
    this.filterFE$.next(this.filterFE);
  }

  public updateFuelLevelFilter(event) {
    this.filterFE.fuelLevel = {
      min: event[0],
      max: event[1]
    };
    this.changeFilterFE();
  }

  public updateBatteryLevelFilter(event) {
    this.filterFE.batteryLevel = {
      min: event[0],
      max: event[1]
    };
    this.changeFilterFE();
  }

}

function filteredAssetsObs(obs: Observable<IFilterFE>) {
  return obs.pipe(
      debounceTime(500),
      switchMap(() => {
        return new Promise(
          (resolve) => {
            resolve();
          }
        );
      })
  );
}
