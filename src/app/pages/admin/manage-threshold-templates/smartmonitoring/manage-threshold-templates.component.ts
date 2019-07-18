import {Component, OnInit} from '@angular/core';
import {NewThreshold, NewThresholdTemplate, ThresholdTemplate} from '../../../../models/threshold.model';
import {ThresholdTemplateService} from '../../../../services/threshold-template.service';
import {ActivatedRoute} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {MatDialog} from '@angular/material';
import {AddSensorComponent} from './add-sensor/add-sensor.component';

@Component({
  selector: 'pvf-manage-threshold-templates',
  templateUrl: './manage-threshold-templates.component.html',
  styleUrls: ['./manage-threshold-templates.component.scss']
})
export class ManageThresholdTemplatesComponent implements OnInit {
  public item: NewThresholdTemplate;
  public id: string | number;
  public severities = ['LOW', 'HIGH', 'CRITICAL'];

  constructor(private thresholdTemplateService: ThresholdTemplateService,
              private activeRoute: ActivatedRoute,
              private dialog: MatDialog
  ) {
  }

  async ngOnInit() {
    this.id = await this.getRouteId();
    if (!isNullOrUndefined(this.id) && this.id !== 'null') {
      this.loadItem();
    } else {
      this.item = new NewThresholdTemplate(null);
      console.info(this.item);
    }
  }

  private async loadItem() {
    // this.item = await this.thresholdTemplateService.getThresholdTemplate(this.id);
  }

  public addThreshold(sensorIdx: number) {
    console.log(sensorIdx);
    this.item.sensors[sensorIdx].thresholds.push(new NewThreshold({
      range: {from: this.item.sensors[sensorIdx].sensorType.min, to: this.item.sensors[sensorIdx].sensorType.max},
      severity: 'LOW',
      alert: {
        notification: false,
        sms: false,
        mail: false
      }
    }));
  }

  public deleteThreshold(sensorIdx: number, thresholdIdx: number) {
    this.item.sensors[sensorIdx].thresholds.splice(thresholdIdx, 1);
  }

  public addSensor() {
    const ref = this.dialog.open(AddSensorComponent, {
      width: '90vw'
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {

        if (!this.item.sensors.find((item) => {
          return item.sensorType.name === result.name;
        })) {
          this.item.sensors.push({
            sensorType: result,
            thresholds: []
          });
        }
      }
    });
  }

  private getRouteId(): Promise<string | number> {
    return new Promise((resolve, reject) => {
      this.activeRoute.params.subscribe((params) => {
        if (!isNullOrUndefined(params.id)) {
          resolve(params.id);
        } else {
          resolve();
        }
      }, reject);
    });
  }
}


