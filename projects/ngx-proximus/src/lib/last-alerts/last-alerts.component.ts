import { IAsset } from 'src/app/models/asset.model';
import { SharedService } from 'src/app/services/shared.service';
import { Component, OnInit, Input } from '@angular/core';
import { IAlert } from 'src/app/models/alert.model';
import * as moment from 'moment';

@Component({
  selector: 'pxs-last-alerts',
  templateUrl: './last-alerts.component.html',
  styleUrls: ['./last-alerts.component.scss']
})
export class LastAlertsComponent implements OnInit {

  @Input() asset: IAsset;
  public alerts: IAlert[];

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
  }

  download() {
    const header: string[] = [
      this.sharedService.translate.instant('GENERAL.DATE'),
      this.sharedService.translate.instant('LAYOUT.ASSET'),
      this.sharedService.translate.instant('LAYOUT.SENSOR'),
      this.sharedService.translate.instant('GENERAL.SEVERITY'),
      this.sharedService.translate.instant('LAYOUT.THRESHOLD_TEMPLATE'),
      this.sharedService.translate.instant('LAYOUT.THING'),
      this.sharedService.translate.instant('LAYOUT.LOCATION'),
      this.sharedService.translate.instant('GENERAL.VALUE'),
      this.sharedService.translate.instant('ALERTS.READ'),
    ];
    let csv = `${header.join(', ')}\n`;
    for (const alert of this.asset.alerts) {
      csv += moment(alert.timestamp).format('DD/MM/YYYY - hh:mm:ss') + ', ';
      csv += this.asset.name + ', ';
      csv += (alert.sensorType || {}).name + ', ';
      csv += alert.severity + (alert.label ? ': ' + alert.label : '') + ', ';
      csv += alert.thresholdTemplateName + ', ';
      csv += ((alert.thing || {}).name || (alert.thing || {}).devEui) + ', ';
      csv += (this.asset.location || {}).name + ', ';
      csv += alert.value + (alert.sensorType || {}).postfix + ', ';
      csv += alert.read;
      csv += '\n';
    }
    this.sharedService.downloadCSV(`${this.asset.name} - Last alerts ${moment().format('DD/MM/YYYY - hh:mm:ss')}`, csv);
  }

  parseLastValue(value: number) {
    return parseFloat(value.toFixed(2));
  }
}
