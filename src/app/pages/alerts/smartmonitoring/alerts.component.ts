import {Component, OnInit} from '@angular/core';
import {AlertsService} from '../../../services/alerts.service';
import {Range} from 'ngx-mat-daterange-picker';
import {PageEvent} from '@angular/material';
import {FilterService} from '../../../services/filter.service';
import * as moment from 'moment';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'pvf-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

  public filter = {
    dateRange: {fromDate: new Date(), toDate: new Date()},
    sensorTypes: [],
    thresholdTemplates: [],
    name: '',
  };

  public filterOptions = {
    sensorTypes: [],
    thresholdTemplates: []
  };

  public allUnreadSelected = false;
  public allReadSelected = false;

  public sensorTypesLoading = false;
  public thresholdTemplatesLoading = false;

  public unreadAlerts = [];
  public unreadAlertsLoading = false;
  public unreadAlertsTotal = 0;
  public unreadAlertsPageSize = 5;
  public unreadAlertsPageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  public currentUnreadAlertsPage = 0;


  public readAlerts = [];
  public readAlertsLoading = true;
  public readAlertsTotal = 0;
  public readAlertsPageSize = 5;
  public readAlertsPageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  public currentReadAlertsPage = 0;

  constructor(
    public alertsService: AlertsService,
    private filterService: FilterService,
    private sharedService: SharedService) {
  }

  async ngOnInit(): Promise<void> {
    this.getSensorTypesOptions();
    this.getThresholdTemplateOptions();
    //this.alertsFilterChange('unread', null);
    //this.alertsFilterChange('read', null);
  }

  public async getSensorTypesOptions(): Promise<void> {
    this.sensorTypesLoading = true;
    this.filterOptions.sensorTypes = (await this.filterService.getSensorTypes()).map((item) => {
      return {label: item.name, id: item.id};
    });
    this.sensorTypesLoading = false;
  }

  public async getThresholdTemplateOptions(): Promise<void> {
    this.thresholdTemplatesLoading = true;
    this.filterOptions.thresholdTemplates = (await this.filterService.getThresholdTemplates()).map((item) => {
      return {label: item.name, id: item.id};
    });
    this.thresholdTemplatesLoading = false;
  }

  public filterNameChange(event) {
    this.alertsFilterChange('unread', null);
    this.alertsFilterChange('read', null);
  }

  public async alertsFilterChange(type: 'unread' | 'read', evt: PageEvent) {
    if (type === 'unread') {
      this.allUnreadSelected = false;
      this.unreadAlertsLoading = true;
      this.unreadAlerts = [];
      if (evt) {
        this.currentUnreadAlertsPage = evt.pageIndex;
        this.unreadAlertsPageSize = evt.pageSize;
      }
      const result = await this.alertsService.getPagedAlerts({
        ...this.filter,
        read: false
      }, this.currentUnreadAlertsPage, this.unreadAlertsPageSize);

      this.unreadAlerts = result.alerts;
      this.unreadAlertsTotal = result.totalElements;
      this.currentUnreadAlertsPage = result.pageNumber;
      this.unreadAlertsLoading = false;
    }
    if (type === 'read') {
      this.allReadSelected = false;
      this.readAlertsLoading = true;
      this.readAlerts = [];
      if (evt) {
        this.currentReadAlertsPage = evt.pageIndex;
        this.readAlertsPageSize = evt.pageSize;
      }
      const result = await this.alertsService.getPagedAlerts({
        ...this.filter,
        read: true
      }, this.currentReadAlertsPage, this.readAlertsPageSize);

      this.readAlerts = result.alerts;
      this.readAlertsTotal = result.totalElements;
      this.currentReadAlertsPage = result.pageNumber;
      this.readAlertsLoading = false;
    }
  }

  public dateRangeChanged(range: Range) {
    this.filter.dateRange = range;
    this.alertsFilterChange('unread', null);
    this.alertsFilterChange('read', null);
  }

  public allSelectedChanged(evt, type: 'unread' | 'read') {
    if (type === 'read') {
      this.readAlerts.map((item) => {
        item.selected = evt.checked;
        return item;
      });
    }
    if (type === 'unread') {
      this.unreadAlerts.map((item) => {
        item.selected = evt.checked;
        return item;
      });
    }
  }

  public singleSelection(evt, type: 'unread' | 'read') {
    if (type === 'read') {
      // check if all selected
      for (const row of this.readAlerts) {
        if (!row.selected) {
          this.allReadSelected = false;
          break;
        }
        this.allReadSelected = true;
      }
      if (this.allReadSelected) {
        if (evt.checked === false) {
          this.allReadSelected = false;
        }
      }
    }

    if (type === 'unread') {
      // check if all selected
      for (const row of this.unreadAlerts) {
        if (!row.selected) {
          this.allUnreadSelected = false;
          break;
        }
        this.allUnreadSelected = true;
      }
      if (this.allUnreadSelected) {
        if (evt.checked === false) {
          this.allUnreadSelected = false;
        }
      }
    }
  }

  public async markSelection(read: boolean) {
    let alerts;
    if (read) {
      alerts = this.unreadAlerts;
    } else {
      alerts = this.readAlerts;
    }
    alerts = alerts.filter(item => item.selected).map(item => item.id);
    await this.alertsService.markAlert(alerts, read);
    this.alertsFilterChange('read', null);
    this.alertsFilterChange('unread', null);
  }


  public async exportAlerts(type) {
    let alerts;
    switch (type) {
      case 'read':
        alerts = this.readAlerts;
        break;
      default:
        alerts = this.unreadAlerts;
        break;
    }

    let csv = 'Asset, Location type, Date, Message, Threshold template, read\n';
    for (const alert of alerts) {
      csv += alert.asset.name + ', ';
      csv += alert.sublocation.location.locationType.name + ', ';
      csv += moment(alert.sensorReading.timestamp).format('DD/MM/YYYY - hh:mm:ss') + ', ';
      csv += alert.thresholdAlert.sensorType.name + ' ' +
        this.alertsService.getAlertType(alert.sensorReading.value, alert.thresholdAlert.high, alert.thresholdAlert.low) +
        ', ';
      csv += alert.asset.thresholdTemplate.name + ', ';
      csv += alert.read;
      csv += '\n';
    }
    this.sharedService.downloadCSV('csv export ' + moment().format('DD/MM/YYYY - hh:mm:ss'), csv);
  }



}
