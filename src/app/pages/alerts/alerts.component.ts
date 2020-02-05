import { DialogModule } from './../../../../projects/ngx-proximus/src/lib/dialog/dialog.module';
import { SubSink } from 'subsink';
import { SensorService } from 'src/app/services/sensor.service';
import { cloneDeep } from 'lodash';
import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatSnackBar, MatDialog} from '@angular/material';
import * as moment from 'moment';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { SharedService } from 'src/app/services/shared.service';
import { IAlert } from 'src/app/models/alert.model';
import { AlertService } from 'src/app/services/alert.service';
import { Subject, Observable } from 'rxjs';
import { switchMap, debounceTime } from 'rxjs/operators';
import { DateRange } from 'projects/ngx-proximus/src/lib/date-range-selection/date-range-selection.component';
import { PopupConfirmationComponent } from 'projects/ngx-proximus/src/lib/popup-confirmation/popup-confirmation.component';


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
export class AlertsComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

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

  private subs = new SubSink();

  constructor(
    private sensorService: SensorService,
    private sharedService: SharedService,
    private snackBar: MatSnackBar,
    private alertService: AlertService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    this.getSensorTypesOptions();
    this.subs.add(
      this.alertService.getAlertsByDateRangeOBS(this.filterBE$).subscribe(
        (alerts) => {
          this.alerts = alerts;
          this.filteredAlerts = cloneDeep(this.alerts);
          this.postFilteredAlerts = cloneDeep(this.filteredAlerts);
          this.updateDataSourceWithAlerts(this.filteredAlerts);
          this.filterFE$.next();
        }
      ),
      filteredAlertsObs(this.filterFE$).subscribe(() => { this.updateFilterdAlerts(); })
    );
  }

  public updateFilterdAlerts() {
    this.isLoading = true;
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
    this.isLoading = false;
  }

  public updateDataSourceWithAlerts(alerts: IAlert[]) {
    this.selectedAlerts = [];
    this.dataSource = new MatTableDataSource(alerts);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (alert, property) => {
        if (property.includes('.')) {
          return property.split('.')
            .reduce((object, key) => {
              if (object && object[key]) {
                return object[key];
              } else {
                return null;
              }
            }, alert);
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
    return this.selectedAlerts.join() === this.postFilteredAlerts.map((alert) => alert.id).join();
  }

  public selectAllAlerts() {
    if (this.checkAllAlerts()) {
      this.selectedAlerts = [];
    } else {
      this.selectedAlerts = this.postFilteredAlerts.map((alert) => alert.id);
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
    if (this.selectedAlerts.length > 5000) {
      return this.dialog.open(PopupConfirmationComponent, {
        minWidth: '320px',
        maxWidth: '400px',
        width: '100vw',
        maxHeight: '80vh',
        data: {
          hideContinue: true,
          title: 'Warning',
          content: 'Mark as read of more than 5000 alerts is not allowed'
        }
      });
    }
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

    this.subs.add(
      this.alertService.readByAlertIds(this.selectedAlerts).subscribe(
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
      )
    );
  }

  public markAsUnread() {
    if (this.selectedAlerts.length > 5000) {
      return this.dialog.open(PopupConfirmationComponent, {
        minWidth: '320px',
        maxWidth: '400px',
        width: '100vw',
        maxHeight: '80vh',
        data: {
          hideContinue: true,
          title: 'Warning',
          content: 'Mark as unread of more than 5000 alerts is not allowed'
        }
      });
    }
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

    this.subs.add(
      this.alertService.unreadByAlertIds(this.selectedAlerts).subscribe(
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
      )
    );
  }

  private getNumberOfAlerts() {
    this.subs.add(
      this.alertService.getNumberOfUnreadAlerts().subscribe()
    );
  }

  public downloadSelectedAlertsCSV() {
    let csv = 'Asset, Location, Date, Message, Threshold template, Thing, Value, read\n';
    this.selectedAlerts.map((alertId) => {
      const index = this.postFilteredAlerts.findIndex((alert) => alert.id === alertId);
      if (index >= 0) {
        csv += (this.postFilteredAlerts[index].asset || {}).name + ', ';
        csv += ((this.postFilteredAlerts[index].asset || {}).location ||  {}).name + ', ';
        csv += moment(this.postFilteredAlerts[index].timestamp).format('DD/MM/YYYY - hh:mm:ss') + ', ';
        csv += (this.postFilteredAlerts[index].sensorType || {}).name + ' ' +
          this.postFilteredAlerts[index].severity + ' ' + (this.postFilteredAlerts[index].label || '') + ', ';
        csv += this.postFilteredAlerts[index].thresholdTemplateName + ', ';
        csv += (this.postFilteredAlerts[index].thing || {}).name + ', ';
        csv += this.postFilteredAlerts[index].value + (this.postFilteredAlerts[index].sensorType || {}).postfix + ', ';
        csv += this.postFilteredAlerts[index].read;
        csv += '\n';
      }
    });
    this.sharedService.downloadCSV('csv export ' + moment().format('DD/MM/YYYY - hh:mm:ss'), csv);
  }

  public downloadSelectedAlertsPDF() {
    const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF (210 x 297)
    const cols = ['Asset', 'Location', 'Date', 'Message', 'Threshold template', 'Thing', 'Value', 'Read'];
    const rows = [];

    this.selectedAlerts.map((alertId) => {
      const index = this.postFilteredAlerts.findIndex((alert) => alert.id === alertId);
      const temp = [
        `${(this.postFilteredAlerts[index].asset || {}).name}`,
        `${((this.postFilteredAlerts[index].asset || {}).location ||  {}).name}`,
        `${moment(this.postFilteredAlerts[index].timestamp).format('DD/MM/YYYY \n hh:mm:ss')}`,
        `${(this.postFilteredAlerts[index].sensorType || {}).name + ' ' + this.postFilteredAlerts[index].severity + ' ' + (this.postFilteredAlerts[index].label || '')}`,
        `${this.postFilteredAlerts[index].thresholdTemplateName}`,
        `${(this.postFilteredAlerts[index].thing || {}).name}`,
        `${this.postFilteredAlerts[index].value + (this.postFilteredAlerts[index].sensorType || {}).postfix}`,
        `${this.postFilteredAlerts[index].read}`,
      ];
      rows.push(temp);
    });

    pdf.autoTable(cols, rows, {
      startY: 10,
      columnStyles: {
        0: {columnWidth: 25},
        1: {columnWidth: 25},
        2: {columnWidth: 30},
        3: {columnWidth: 30},
        4: {columnWidth: 20},
        5: {columnWidth: 25},
        6: {columnWidth: 20},
        7: {columnWidth: 15},
      }
    });
    pdf.save(`alerts.pdf`);
  }

  public async getSensorTypesOptions(): Promise<void> {
    this.sensorTypesLoading = true;
    this.filterOptions.sensorTypes = (await this.sensorService.getSensorTypeNames().toPromise()).map((sensorType) => {
      return {label: sensorType.name, id: sensorType.id};
    });
    this.sensorTypesLoading = false;
  }

  public dateRangeChange(dateRange: DateRange) {
    this.isLoading = true;
    this.changeDetectorRef.detectChanges();
    this.filterBE.dateRange = dateRange;
    this.filterBE$.next(this.filterBE);
  }

  public displayRange(alert: IAlert): string {
    return `${alert.range.from}${alert.sensorType.postfix} - ${alert.range.to}${alert.sensorType.postfix}`;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
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
