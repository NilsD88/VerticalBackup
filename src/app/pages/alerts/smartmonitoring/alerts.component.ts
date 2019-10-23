import { NewSensorService } from './../../../services/new-sensor.service';
import { cloneDeep } from 'lodash';
import { IPagedAlerts } from './../../../models/g-alert.model';
import {Component, OnInit, ViewChild} from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatSnackBar} from '@angular/material';
import * as moment from 'moment';
import { SharedService } from 'src/app/services/shared.service';
import { IAlert } from 'src/app/models/g-alert.model';
import { NewAlertService } from 'src/app/services/new-alert.service';
import { Subject, Observable } from 'rxjs';
import { switchMap, debounceTime } from 'rxjs/operators';
import { DateRange } from 'projects/ngx-proximus/src/lib/date-range-selection/date-range-selection.component';


export interface IAlertFilterBE {
  dateRange: {
    fromDate: Date;
    toDate: Date;
  };
}

interface IAlertFilterFE {
  sensorTypeIds: string[];
  thresholdTemplateName: string;
  name: string;
}

enum SeverityLevel {
  LOW = 0,
  MEDIUM = 1,
  CRITICAL = 2,
}

@Component({
  selector: 'pvf-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public alerts: IAlert[] = [];
  public filteredAlerts: IAlert[] = [];
  public postFilteredAlerts: IAlert[] = [];
  public selectedAlerts: string[] = [];

  public filterFE$ = new Subject<IAlertFilterFE>();
  public filterBE$ = new Subject<IAlertFilterBE>();

  public dataSource;
  public isLoading = false;
  public displayedColumns: string[] = ['select', 'read', 'timestamp', 'sensorType.name', 'severity', 'thresholdTemplateName', 'thing.devEui', 'asset.location.name', 'value'];


  public filterBE: IAlertFilterBE = {
    dateRange: {
      fromDate: moment().subtract(2, 'week').toDate(),
      toDate: moment().toDate()
    }
  };

  public filterFE: IAlertFilterFE = {
    sensorTypeIds: [],
    thresholdTemplateName: '',
    name: '',
  };

  public filterOptions = {
    sensorTypes: [],
    readFilter: 'ALL'
  };

  public sensorTypesLoading = false;

  constructor(
    private newSensorService: NewSensorService,
    private sharedService: SharedService,
    private snackBar: MatSnackBar,
    private newAlertService: NewAlertService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.getSensorTypesOptions();
    this.newAlertService.getAlertsByDateRangeOBS(this.filterBE$).subscribe(
      (alerts) => {
        this.alerts = alerts;
        this.filteredAlerts = cloneDeep(this.alerts);
        this.postFilteredAlerts = cloneDeep(this.filteredAlerts);
        this.updateDataSourceWithAlerts(this.filteredAlerts);
        this.isLoading = false;
      }
    );
    filteredAlertsObs(this.filterFE$).subscribe(() => { this.updateFilterdAlerts(); });
  }

  public updateFilterdAlerts() {
    this.filteredAlerts = cloneDeep(this.alerts).filter((alert: IAlert) => {
      let result = true;

      if (this.filterFE.name && result) {
        if ((alert.asset || {}).name) {
          const TERM = this.filterFE.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
          result = alert.asset.name.toLocaleUpperCase().includes(TERM);
        } else {
          result = false;
        }
      }

      if (this.filterFE.sensorTypeIds.length && result) {
        if ((alert.sensorType || {}).id) {
          result = this.filterFE.sensorTypeIds.includes(alert.sensorType.id);
        } else {
          result = false;
        }
      }

      if (this.filterFE.thresholdTemplateName && result) {
        if (alert.thresholdTemplateName) {
          const TERM = this.filterFE.thresholdTemplateName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
          result = alert.thresholdTemplateName.toLocaleUpperCase().includes(TERM);
        } else {
          result = false;
        }
      }

      return result;
    });
    this.changeReadFilter(this.filterOptions.readFilter);
  }

  public updateDataSourceWithAlerts(alerts: IAlert[]) {
    this.selectedAlerts = [];
    this.dataSource = new MatTableDataSource(alerts);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (alert, property) => {
        if (property.includes('.')) {
          return property.split('.')
            .reduce((object, key) => object[key], alert);
        }
        switch (property) {
          case 'severity':
            return SeverityLevel[alert[property]];
          case 'timestamp':
            return alert[property];
          default:
            return alert[property].toLocaleLowerCase();
        }
    };
    this.dataSource.sort = this.sort;
  }

  public changeReadFilter(value: string) {
    switch (value) {
      case 'UNREAD':
        this.postFilteredAlerts = this.filteredAlerts.filter((alert) => alert.read === false);
        break;
      case 'READ':
        this.postFilteredAlerts = this.filteredAlerts.filter((alert) => alert.read === true);
        break;
      case 'ALL':
      default:
        this.postFilteredAlerts = this.filteredAlerts;
        break;
    }

    this.filterOptions.readFilter = value;
    this.updateDataSourceWithAlerts(this.postFilteredAlerts);
  }

  public changeFilterFE() {
    this.filterFE$.next(this.filterFE);
  }

  public checkOneAlert(id: string) {
    return this.selectedAlerts.some((alertId) => alertId === id);
  }

  public checkAllAlerts() {
    return this.selectedAlerts.join() === this.filteredAlerts.map((alert) => alert.id).join();
  }

  public selectAllAlerts() {
    if (this.checkAllAlerts()) {
      this.selectedAlerts = [];
    } else {
      this.selectedAlerts = this.filteredAlerts.map((alert) => alert.id);
    }
  }

  public selectOneAlert(alert: IAlert) {
    const alertIndex = this.selectedAlerts.findIndex((alertId) => alertId === alert.id);
    if (alertIndex > -1) {
      this.selectedAlerts.splice(alertIndex, 1);
    } else {
      this.selectedAlerts.push(alert.id);
    }
  }

  public markAsRead() {
    const oldA = cloneDeep(this.alerts);
    const oldF = cloneDeep(this.filteredAlerts);
    const oldP = cloneDeep(this.postFilteredAlerts);
    const oldSelectedAlerts = [...this.selectedAlerts];

    this.selectedAlerts.map((alertId) => {
      const indexA = this.alerts.findIndex((alert) => alert.id === alertId);
      const indexF = this.filteredAlerts.findIndex((alert) => alert.id === alertId);
      const indexP = this.postFilteredAlerts.findIndex((alert) => alert.id === alertId);
      this.alerts[indexA].read = true;
      this.filteredAlerts[indexF].read = true;
      this.postFilteredAlerts[indexP].read = true;
    });

    this.newAlertService.readByAlertIds(this.selectedAlerts).subscribe(
      result => {
        if (result) {
          this.getNumberOfAlerts();
          return true;
        }
      },
      error => {
        this.snackBar.open(`Failed to read the alerts`, null, {
          duration: 2000,
        });
        console.log(error);
        this.alerts = oldA;
        this.filteredAlerts = oldF;
        this.postFilteredAlerts = oldP;
        this.updateDataSourceWithAlerts(this.postFilteredAlerts);
        this.selectedAlerts = oldSelectedAlerts;
      }
    );
  }

  public markAsUnread() {
    const oldA = cloneDeep(this.alerts);
    const oldF = cloneDeep(this.filteredAlerts);
    const oldP = cloneDeep(this.postFilteredAlerts);
    const oldSelectedAlerts = [...this.selectedAlerts];

    this.selectedAlerts.map((alertId) => {
      const indexA = this.alerts.findIndex((alert) => alert.id === alertId);
      const indexF = this.filteredAlerts.findIndex((alert) => alert.id === alertId);
      const indexP = this.postFilteredAlerts.findIndex((alert) => alert.id === alertId);
      this.alerts[indexA].read = false;
      this.filteredAlerts[indexF].read = false;
      this.postFilteredAlerts[indexP].read = false;
    });

    this.newAlertService.unreadByAlertIds(this.selectedAlerts).subscribe(
      result => {
        if (result) {
          this.getNumberOfAlerts();
          return true;
        }
      },
      error => {
        this.snackBar.open(`Failed to unread the alerts`, null, {
          duration: 2000,
        });
        console.log(error);
        this.alerts = oldA;
        this.filteredAlerts = oldF;
        this.postFilteredAlerts = oldP;
        this.updateDataSourceWithAlerts(this.postFilteredAlerts);
        this.selectedAlerts = oldSelectedAlerts;
      }
    );
  }

  private getNumberOfAlerts() {
    this.newAlertService.getNumberOfUnreadAlerts().subscribe();
  }

  public pageChange(event) {
    this.getPagedAlerts();
  }

  public async getPagedAlerts() {
    this.selectedAlerts = [];
    const pagedAlerts: IPagedAlerts = await this.newAlertService.getPagedAlerts(
      this.paginator.pageIndex,
      this.paginator.pageSize
    ).toPromise();
  }

  public downloadSelectedAlerts() {
    let csv = 'Asset, Location type, Date, Message, Threshold template, Thing, Value, read\n';
    this.selectedAlerts.map((alertId) => {
      const index = this.filteredAlerts.findIndex((alert) => alert.id === alertId);
      if (index) {
        csv += (this.filteredAlerts[index].asset || {}).name + ', ';
        csv += ((this.filteredAlerts[index].asset || {}).location ||  {}).name + ', ';
        csv += moment(this.filteredAlerts[index].timestamp).format('DD/MM/YYYY - hh:mm:ss') + ', ';
        csv += (this.filteredAlerts[index].sensorType || {}).name + ' ' +
          this.filteredAlerts[index].severity + ' ' + (this.filteredAlerts[index].label || '') + ', ';
        csv += this.filteredAlerts[index].thresholdTemplateName + ', ';
        csv += (this.filteredAlerts[index].thing || {}).name + ', ';
        csv += this.filteredAlerts[index].value + (this.filteredAlerts[index].sensorType || {}).postfix + ', ';
        csv += this.filteredAlerts[index].read;
        csv += '\n';
      }
    });
    this.sharedService.downloadCSV('csv export ' + moment().format('DD/MM/YYYY - hh:mm:ss'), csv);
  }

  public async getSensorTypesOptions(): Promise<void> {
    this.sensorTypesLoading = true;
    this.filterOptions.sensorTypes = (await this.newSensorService.getSensorTypeNames().toPromise()).map((sensorType) => {
      return {label: sensorType.name, id: sensorType.id};
    });

    /*

    this.filterOptions.sensorTypes = (await this.filterService.getSensorTypes()).map((item) => {
      // TODO: remove toString() when new backend will return string id
      return {label: item.name, id: item.id.toString()};
    });
    */
    this.sensorTypesLoading = false;
  }

  public dateRangeChange(dateRange: DateRange) {
    this.isLoading = true;
    this.filterBE.dateRange = dateRange;
    this.filterBE$.next(this.filterBE);
  }
}


function filteredAlertsObs(obs: Observable<IAlertFilterFE>) {
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
