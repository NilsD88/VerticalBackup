import { SharedService } from './../../../../../src/app/services/shared.service';
import { Component, OnInit, Input } from '@angular/core';
import { IAlert } from './../../../../../src/app/models/g-alert.model';
import * as moment from 'moment';

@Component({
  selector: 'pxs-last-alerts',
  templateUrl: './last-alerts.component.html',
  styleUrls: ['./last-alerts.component.scss']
})
export class LastAlertsComponent implements OnInit {

  @Input() alerts: IAlert[];

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
  }

  download() {
    let csv = 'Date, Asset, Sensor, Severity, Threshold template, Thing, Location, Value, Read\n';
    for (const alert of this.alerts) {
      csv += moment(alert.timestamp).format('DD/MM/YYYY - hh:mm:ss') + ', ';
      csv += (alert.asset || {}).name + ', ';
      csv += (alert.sensorType || {}).name + ', ';
      csv += alert.severity + (alert.label ? ': ' + alert.label : '') + ', ';
      csv += alert.thresholdTemplateName + ', ';
      csv += (alert.thing || {}).name + ', ';
      csv += ((alert.asset || {}).location || {}).name + ', ';
      csv += alert.value + (alert.sensorType || {}).postfix + ', ';
      csv += alert.read;
      csv += '\n';
    }
    this.sharedService.downloadCSV(`${this.alerts[0].asset.name} - Last alerts ${moment().format('DD/MM/YYYY - hh:mm:ss')}`, csv);
  }

}
