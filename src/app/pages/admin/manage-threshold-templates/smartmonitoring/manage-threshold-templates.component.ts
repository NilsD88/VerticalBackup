import { MOCK_SENSORTYPES } from './../../../../mocks/sensortypes';
import {Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import {NewThreshold, NewThresholdTemplate, ThresholdTemplate, INewThreshold} from '../../../../models/threshold.model';
import {ThresholdTemplateService} from '../../../../services/threshold-template.service';
import {ActivatedRoute} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {MatDialog} from '@angular/material';
import {AddSensorComponent} from './add-sensor/add-sensor.component';
import { SensorType } from 'src/app/models/sensor.model';

@Component({
  selector: 'pvf-manage-threshold-templates',
  templateUrl: './manage-threshold-templates.component.html',
  styleUrls: ['./manage-threshold-templates.component.scss']
})
export class ManageThresholdTemplatesComponent implements OnInit {

  public thresholdTemplateFormGroup: FormGroup;
  public item: NewThresholdTemplate;
  public id: string | number;
  public severities = ['LOW', 'HIGH', 'CRITICAL'];


  constructor(
    private formBuilder: FormBuilder,
    private thresholdTemplateService: ThresholdTemplateService,
    private activeRoute: ActivatedRoute,
    private dialog: MatDialog) {}

  async ngOnInit() {
    this.id = await this.getRouteId();
    if (!isNullOrUndefined(this.id)) {
      await this.loadItem();
    } else {
      this.item = new NewThresholdTemplate(null);
      this.thresholdTemplateFormGroup = this.formBuilder.group({
        name: ['', Validators.required],
      });


      this.thresholdTemplateFormGroup.addControl(`sensor-${MOCK_SENSORTYPES[2].id}`, this.formBuilder.group({
        thresholds: this.formBuilder.group({})
      }));


      this.item.sensors.push({
        sensorType: MOCK_SENSORTYPES[2],
        thresholds: []
      });



      /*
      this.thresholdTemplateFormGroup.addControl(MOCK_SENSORTYPES[1].id, this.formBuilder.group({
      thresholds: this.formBuilder.group({
        0: this.formBuilder.group({
          severity: ['', Validators.required],
          label: ['', null],
          alerts: this.formBuilder.group({
            web: ['', Validators.required],
            mail: ['', Validators.required],
            sms: ['', Validators.required],
          }),
          counter: this.formBuilder.group({
            mode: ['', Validators.required],
            limit: ['', Validators.required],
          })
        })
      })
    }));

  */

    }
  }


  private createFormControlForItem(sensorId: number) {
    this.thresholdTemplateFormGroup.addControl(`sensor-${sensorId}`, this.formBuilder.group({
      thresholds: this.formBuilder.group({})
    }));
  }

  private createFormControlForNumberItem(sensorId, thresholdId) {
    const sensorControl: AbstractControl = this.thresholdTemplateFormGroup.get(`sensor-${sensorId}`);
    if (sensorControl instanceof FormGroup) {
      const thresholdControl: AbstractControl = sensorControl.get(`thresholds`);
      if (thresholdControl instanceof FormGroup) {
        (thresholdControl as FormGroup).addControl(thresholdId, this.formBuilder.group({
          severity: ['', Validators.required],
          label: ['', null],
          alerts: this.formBuilder.group({
            web: ['', Validators.required],
            mail: ['', Validators.required],
            sms: ['', Validators.required],
          })
        }));
      }
    }
  }

  private createFormControlForCounterItem(sensorId, thresholdId) {
    const sensorControl: AbstractControl = this.thresholdTemplateFormGroup.get(`sensor-${sensorId}`);
    if (sensorControl instanceof FormGroup) {
      const thresholdControl: AbstractControl = sensorControl.get(`thresholds`);
      if (thresholdControl instanceof FormGroup) {
        (thresholdControl as FormGroup).addControl(thresholdId, this.formBuilder.group({
          severity: ['', Validators.required],
          label: ['', null],
          alerts: this.formBuilder.group({
            web: ['', Validators.required],
            mail: ['', Validators.required],
            sms: ['', Validators.required],
          }),
          counter: this.formBuilder.group({
            mode: ['', Validators.required],
            limit: ['', Validators.required],
          })
        }));
      }
    }
  }

  private createFormControlForBooleanItem(sensorId, thresholdId) {
    const sensorControl: AbstractControl = this.thresholdTemplateFormGroup.get(`sensor-${sensorId}`);
    if (sensorControl instanceof FormGroup) {
      const thresholdControl: AbstractControl = sensorControl.get(`thresholds`);
      if (thresholdControl instanceof FormGroup) {
        (thresholdControl as FormGroup).addControl(thresholdId, this.formBuilder.group({
          severity: ['', Validators.required],
          label: ['', null],
          alerts: this.formBuilder.group({
            web: ['', Validators.required],
            mail: ['', Validators.required],
            sms: ['', Validators.required],
          }),
          value: ['', Validators.required],
        }));
      }
    }
  }

  private async loadItem() {
    // this.item = await this.thresholdTemplateService.getThresholdTemplate(this.id);
  }


  public addThreshold(sensorId: number) {

    const sensor = this.item.sensors.find((elt) => elt.sensorType.id === sensorId);
    console.log({...this.item.sensors});
    console.log(sensorId);
    const threshold = new NewThreshold({
      id: new Date().getTime(),
      range: {from: sensor.sensorType.min, to: sensor.sensorType.max},
      severity: 'LOW',
      alert: {
        notification: false,
        sms: false,
        mail: false
      }
    });
    sensor.thresholds.push(threshold);
    switch (sensor.sensorType.type) {
      case 'NUMBER':
          this.createFormControlForNumberItem(sensorId, threshold.id);
          break;
      case 'COUNTER':
          this.createFormControlForCounterItem(sensorId, threshold.id);
          break;
      case 'BOOLEAN':
          this.createFormControlForBooleanItem(sensorId, threshold.id);
          break;
    }
  }

  public deleteThreshold(sensorId, thresholdId) {
    const findSensorIndex = this.item.sensors.findIndex((elt) => elt.sensorType.id === sensorId);
    const findThresholdIndex = this.item.sensors[findSensorIndex].thresholds.findIndex((elt) => elt.id === thresholdId);
    this.item.sensors[findSensorIndex].thresholds.splice(findThresholdIndex, 1);
    const sensorControl: AbstractControl = this.thresholdTemplateFormGroup.get(`sensor-${sensorId}`);
    if (sensorControl instanceof FormGroup) {
      const thresholdControl: AbstractControl = sensorControl.get(`thresholds`);
      if (thresholdControl instanceof FormGroup) {
        thresholdControl.removeControl(thresholdId);
      }
    }
  }

  public deleteSensor(sensorId) {
    const findSensorIndex = this.item.sensors.findIndex((elt) => elt.sensorType.id === sensorId);
    this.item.sensors.splice(findSensorIndex, 1);
    this.thresholdTemplateFormGroup.removeControl(`sensor-${sensorId}`);
  }

  public changeRange(threshold: INewThreshold, event: [number, number]) {
    threshold.range.from = event[0];
    threshold.range.to = event[1];
  }

  public addSensor() {
    const ref = this.dialog.open(AddSensorComponent, {
      width: '90vw'
    });
    ref.afterClosed().subscribe((result: SensorType) => {
      if (result) {
        if (!this.item.sensors.find((item) => {
          return item.sensorType.name === result.name;
        })) {
          this.item.sensors.push({
            sensorType: result,
            thresholds: []
          });
          this.createFormControlForItem(+result.id);
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


  public saveThresholdTemplate() {
    console.log(this.item);
  }


}


