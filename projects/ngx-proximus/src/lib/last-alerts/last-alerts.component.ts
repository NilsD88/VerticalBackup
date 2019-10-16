import { Component, OnInit, Input } from '@angular/core';
import { IAlert } from './../../../../../src/app/models/g-alert.model';

@Component({
  selector: 'pxs-last-alerts',
  templateUrl: './last-alerts.component.html',
  styleUrls: ['./last-alerts.component.scss']
})
export class LastAlertsComponent implements OnInit {

  @Input() lastAlerts: IAlert[];
  constructor() { }

  ngOnInit() {
  }

}
