import { TSmartTankStatus, STATUSES } from './../../../models/smart-tank/asset.model';
import { isNullOrUndefined } from 'util';
import { ISmartTankLocation } from './../../../models/smart-tank/location.model';
import { SharedService } from './../../../services/shared.service';
import { SubSink } from 'subsink';
import { SmartTankAssetService } from './../../../services/smart-tank/asset.service';
import { cloneDeep } from 'lodash';
import { ISmartTankAsset } from 'src/app/models/smart-tank/asset.model';
import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material';
import { Subject, Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ILocation } from 'src/app/models/location.model';
import { SmartTankLocationService } from 'src/app/services/smart-tank/location.service';
import * as moment from 'moment';


interface IRange {
  min: number;
  max: number;
}

interface IFilterFE {
  assetName: string;
  locationName: string;
  statuses: string[];
  fillLevel: IRange;
  batteryLevel: IRange;
}

@Component({
  selector: 'pvf-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  public rootLocation: ILocation;
  public assets: ISmartTankAsset[] = [];
  public filteredAssetsOnMap: ISmartTankAsset[];
  public filteredAssetsOnTable: ISmartTankAsset[];
  public assetUrl = '/private/smart-tank/consumptions/';

  public dataSource;
  public chartData: any[];
  public isLoading = false;

  public filterFE: IFilterFE = {
    fillLevel: {
      min: 0,
      max: 100
    },
    batteryLevel: {
      min: 0,
      max: 100
    },
    statuses: ['EMPTY', 'LOW', 'OK', 'UNKNOWN'],
    assetName: '',
    locationName: ''
  };

  public chartColors = [
    'rgba(204, 0, 0, 0.7)', // empty
    'rgba(255, 204, 51, 1)', // low
    'rgba(102, 204, 0, 0.7)', // ok
    'rgba(100, 100, 100, 0.7)', // unknow
  ];

  public displayedColumns: string[] = ['name', 'thing', 'location.name', 'fill', 'battery', 'actions'];
  public filterFE$ = new Subject<IFilterFE>();

  private subs = new SubSink();

  constructor(
    private assetService: SmartTankAssetService,
    private locationService: SmartTankLocationService,
    private sharedService: SharedService
  ) {}

  async ngOnInit() {
    this.isLoading = true;
    let rootLocation: ISmartTankLocation;
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
    this.assets = await this.assetService.getAssets().toPromise();

    this.assets.forEach((asset) => {
      const THINGS = asset.things;
      if ((THINGS || []).length) {
        const SENSORS = THINGS[0].sensors;
        const FILL_LEVEL = SENSORS.filter(sensor => sensor.sensorType.name === 'tank fill level')[0];
        asset.batteryLevel =  THINGS[0].batteryPercentage;
        if (FILL_LEVEL) {
          const VALUE = FILL_LEVEL.value;
          const TIMESTAMP = FILL_LEVEL.timestamp;
          const HOURS = moment.duration(moment().diff(moment(+TIMESTAMP))).asHours();
          if (HOURS > 48) {
            asset.status = 'UNKNOWN';
          } else {
            if (VALUE) {
              if (VALUE < 10) {
                asset.status = 'EMPTY';
              } else if (VALUE < 20) {
                asset.status = 'LOW';
              } else {
                asset.status = 'OK';
              }
            } else {
              asset.status = 'UNKNOWN';
            }
          }
          asset.fillLevel = VALUE ? +VALUE : null;
        }
      }
    });

    this.updateDataSourceWithFilteredAssets(this.assets);
    this.updateLocationWithStatus(rootLocation);
    this.rootLocation = rootLocation;
    this.isLoading = false;
    this.subs.sink = filteredAssetsObs(this.filterFE$).subscribe(() => { 
      this.updateFilteredAssetsOnMap();
      this.updateFilteredAssetsOnTable();
    });
    this.changeFilterFE();
  }

  private updateFilteredAssetsOnTable() {
    const filteredAssets = cloneDeep(this.assets).filter((asset: ISmartTankAsset) => {
      let result = true;
      if (this.filterFE.assetName && result) {
        if (asset.name) {
          const TERM = this.filterFE.assetName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
          result = asset.name.toLocaleUpperCase().includes(TERM);
        } else {
          result = false;
        }
      }

      if (this.filterFE.locationName && result) {
        if (asset.location) {
          const TERM = this.filterFE.locationName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
          result = asset.location.name.toLocaleUpperCase().includes(TERM);
        } else {
          result = false;
        }
      }

      if (this.filterFE.statuses.length && result) {
        result = this.filterFE.statuses.includes(asset.status);
      }

      if (this.filterFE.batteryLevel && result) {
        const {min, max} = this.filterFE.batteryLevel;
        const batteryLevel = asset.batteryLevel;
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

      if (this.filterFE.fillLevel && result) {
        const {min, max} = this.filterFE.fillLevel;
        const fillLevel = asset.fillLevel;
        if (min === 0 && max === 100) {
          result = true;
        } else {
          if (fillLevel >= min && fillLevel <= max) {
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

  private updateFilteredAssetsOnMap() {
    const filteredAssets = cloneDeep(this.assets).filter((asset: ISmartTankAsset) => {
      let result = true;

      if (this.filterFE.statuses.length && result) {
        result = this.filterFE.statuses.includes(asset.status);
      }

      if (this.filterFE.batteryLevel && result) {
        const {min, max} = this.filterFE.batteryLevel;
        const batteryLevel = asset.batteryLevel;
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

      if (this.filterFE.fillLevel && result) {
        const {min, max} = this.filterFE.fillLevel;
        const fillLevel = asset.fillLevel;
        if (min === 0 && max === 100) {
          result = true;
        } else {
          if (fillLevel >= min && fillLevel <= max) {
            result = true;
          } else {
            result = false;
          }
        }
      }

      return result;
    });
    this.filteredAssetsOnMap = filteredAssets;
  }

  public updateDataSourceWithFilteredAssets(assets: ISmartTankAsset[]) {
    this.filteredAssetsOnTable = assets = this.assets.sort((a, b) => a.fillLevel - b.fillLevel);
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
          case 'fill':
            return asset.fillLevel;
          case 'battery':
              return asset.batteryLevel;
          case 'thing':
              return asset.things[0].devEui.toLocaleLowerCase();
          default:
            return asset[property].toLocaleLowerCase();
        }
    };
    this.dataSource.sort = this.sort;
    this.createChartData(assets);
  }

  public async createChartData(assets: ISmartTankAsset[]) {
    const chartData = [];
    const STATUS_ASSETS = {
      EMPTY: [],
      LOW: [],
      OK: [],
      UNKNOWN: [],
    };

    assets.forEach((asset) => {
      STATUS_ASSETS[asset.status].push(asset);
    });

    for (const status in STATUS_ASSETS) {
      if (status) {
        chartData.push({
          name: this.sharedService.translate.instant('SMART_TANK.STATUS.' + status),
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

  public updateFillLevelFilter(event) {
    this.filterFE.fillLevel = {
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

  public downloadSelectedAssetCSV() {
    const header: string[] = [
      this.sharedService.translate.instant('GENERAL.NAME'),
      this.sharedService.translate.instant('GENERAL.THING_ID'),
      this.sharedService.translate.instant('LAYOUT.LOCATION'),
      this.sharedService.translate.instant('SMART_TANK.FUEL_LEVEL'),
      this.sharedService.translate.instant('GENERAL.BATTERY_LEVEL'),
    ];
    let csv = `${header.join(', ')}\n`;
    for (const asset of this.filteredAssetsOnTable) {
      const thing = ((asset.things || [])[0] || {});
      csv += asset.name + ', ';
      csv += thing.devEui + ', ';
      csv += asset.location ? (asset.location.name + ', ') : ', ';
      csv += asset.fillLevel ? (asset.fillLevel + '%, ') : 'unknown, ';
      csv += asset.batteryLevel ? (asset.batteryLevel + '%') : 'unknown';
      csv += '\n';
    }
    this.sharedService.downloadCSV('SmartTank_' + moment().format('DD/MM/YYYY - hh:mm:ss'), csv);
  }


  private updateLocationWithStatus(location: ISmartTankLocation) {
    let status: TSmartTankStatus;
    const statuses: TSmartTankStatus[] = [];

    if (!isNullOrUndefined(location.id)) {
      const assets = this.assets.filter(asset => (asset.location || {}).id === location.id);
      if (assets.length) {
        for (const asset of assets) {
          statuses.push(asset.status);
        }
      }
    }

    if ((location.children || []).length) {
      for (const leaf of location.children) {
        this.updateLocationWithStatus(leaf);
        statuses.push(leaf.status);
      }
    }

    for (const STATUS of STATUSES) {
      if (statuses.some(x => x === STATUS)) {
        status = STATUS;
      }
    }

    location.status = status;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
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

