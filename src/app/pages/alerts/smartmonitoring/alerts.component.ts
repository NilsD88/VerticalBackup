import {Component, OnInit} from '@angular/core';
import {ALERTS_MOCK} from '../mockdata';
import {SharedAlertsService} from '../shared-alerts.service';
import {Range} from 'ngx-mat-daterange-picker';
import * as moment from 'moment';
import {PageEvent} from '@angular/material';
import {ISensorType, SensorType} from '../../../models/sensor.model';
import {FilterService} from '../../../services/filter.service';

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
    locationTypes: []
  };
  public filterOptions = {
    sensorTypes: []
  };

  public sensorTypesLoading = false;

  public unreadAlerts = [];
  public unreadAlertsLoading = false;
  public unreadAlertsTotal = 0;
  public unreadAlertsPageSize = 5;
  public unreadAlertsPageSizeOptions: number[] = [5, 10, 25, 100];
  public currentUnreadAlertsPage = 0;


  public readAlerts = [];
  public readAlertsLoading = true;
  public readAlertsTotal = 0;
  public readAlertsPageSize = 5;
  public readAlertsPageSizeOptions: number[] = [5, 10, 25, 100];
  public currentReadAlertsPage = 0;

  constructor(public sharedAlertsService: SharedAlertsService, private filterService: FilterService) {
  }

  async ngOnInit(): Promise<void> {
    this.getSensorTypesOptions();
    await this.alertsFilterChange('unread', null);
    await this.alertsFilterChange('read', null);

  }

  public async getSensorTypesOptions(): Promise<void> {
    this.sensorTypesLoading = true;
    this.filter.sensorTypes = (await this.filterService.getSensorTypes()).map((item) => {
      return {name: item.name, id: item.id};
    });
    this.sensorTypesLoading = false;
  }

  public async alertsFilterChange(type: 'unread' | 'read', evt: PageEvent) {
    if (type === 'unread') {
      this.unreadAlertsLoading = true;
      this.unreadAlerts = [];
      if (evt) {
        this.currentUnreadAlertsPage = evt.pageIndex;
        this.unreadAlertsPageSize = evt.pageSize;
      }
      const result = await this.sharedAlertsService.getPagedAlerts({
        ...this.filter,
        read: false
      }, this.currentUnreadAlertsPage, this.unreadAlertsPageSize);

      this.unreadAlerts = result.alerts;
      this.unreadAlertsTotal = result.totalElements;
      this.currentUnreadAlertsPage = result.pageNumber;
      this.unreadAlertsLoading = false;
    }
    if (type === 'read') {
      this.readAlertsLoading = true;
      this.readAlerts = [];
      if (evt) {
        this.currentReadAlertsPage = evt.pageIndex;
        this.readAlertsPageSize = evt.pageSize;
      }
      const result = await this.sharedAlertsService.getPagedAlerts({
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
}
