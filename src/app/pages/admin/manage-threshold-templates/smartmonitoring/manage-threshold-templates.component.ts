import { NewThresholdTemplateService } from './../../../../services/new-threshold-templates';
import { MOCK_SENSORTYPES } from './../../../../mocks/sensortypes';
import {Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import {ThresholdTemplateService} from '../../../../services/threshold-template.service';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {MatDialog} from '@angular/material';
import {AddSensorComponent} from './add-sensor/add-sensor.component';
import { SensorType } from 'src/app/models/sensor.model';
import { INewThresholdTemplate, INewThreshold, NewThresholdTemplate, NewThreshold } from 'src/app/models/new-threshold-template.model';

@Component({
  selector: 'pvf-manage-threshold-templates',
  templateUrl: './manage-threshold-templates.component.html',
  styleUrls: ['./manage-threshold-templates.component.scss']
})
export class ManageThresholdTemplatesComponent implements OnInit {

  public thresholdTemplateFormGroup: FormGroup;
  public thresholdTemplate: INewThresholdTemplate;
  public severities = ['LOW', 'MEDIUM', 'CRITICAL'];
  public editMode = false;


  constructor(
    private formBuilder: FormBuilder,
    private newThresholdTemplateService: NewThresholdTemplateService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private dialog: MatDialog) {}

  async ngOnInit() {
    const thresholdTemplateId = await this.getRouteId();
    if (!isNullOrUndefined(thresholdTemplateId)) {
      this.editMode = true;
      this.thresholdTemplate= await this.newThresholdTemplateService.getThresholdTemplateById(+thresholdTemplateId);
      this.thresholdTemplateFormGroup = this.formBuilder.group({
        name: ['', Validators.required],
      });
      for (const sensor of this.thresholdTemplate.sensors) {
        const sensorId = sensor.sensorType.id;
        this.thresholdTemplateFormGroup.addControl(`sensor-${sensorId}`, this.formBuilder.group({
          thresholds: this.formBuilder.group({})
        }));
        for (const threshold of sensor.thresholds) {
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
      }
    } else {
      this.thresholdTemplate = new NewThresholdTemplate(null);
      this.thresholdTemplateFormGroup = this.formBuilder.group({
        name: ['', Validators.required],
      });
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
            from: ['', Validators.required],
            to: ['', Validators.required],
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
          boolean: ['', Validators.required],
        }));
      }
    }
  }

  public addThreshold(sensorId: number) {

    const sensor = this.thresholdTemplate.sensors.find((elt) => elt.sensorType.id === sensorId);

    const threshold = new NewThreshold({
      id: new Date().getTime(),
      range: {from: sensor.sensorType.min, to: sensor.sensorType.max},
      severity: 'LOW',
      alert: {
        web: false,
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
    const findSensorIndex = this.thresholdTemplate.sensors.findIndex((elt) => elt.sensorType.id === sensorId);
    const findThresholdIndex = this.thresholdTemplate.sensors[findSensorIndex].thresholds.findIndex((elt) => elt.id === thresholdId);
    this.thresholdTemplate.sensors[findSensorIndex].thresholds.splice(findThresholdIndex, 1);
    const sensorControl: AbstractControl = this.thresholdTemplateFormGroup.get(`sensor-${sensorId}`);
    if (sensorControl instanceof FormGroup) {
      const thresholdControl: AbstractControl = sensorControl.get(`thresholds`);
      if (thresholdControl instanceof FormGroup) {
        thresholdControl.removeControl(thresholdId);
      }
    }
  }

  public deleteSensor(sensorId) {
    const findSensorIndex = this.thresholdTemplate.sensors.findIndex((elt) => elt.sensorType.id === sensorId);
    this.thresholdTemplate.sensors.splice(findSensorIndex, 1);
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
        if (!this.thresholdTemplate.sensors.find((item) => {
          return item.sensorType.name === result.name;
        })) {
          this.thresholdTemplate.sensors.push({
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
    if (this.editMode) {
      this.newThresholdTemplateService.updateThresholdTemplate(this.thresholdTemplate).subscribe((result) => {
        this.goToManageThresholdTemplate();
      });
    } else {
      this.newThresholdTemplateService.createThresholdTemplate(this.thresholdTemplate).subscribe((result) => {
        this.goToManageThresholdTemplate();
      });
    }
  }

  private goToManageThresholdTemplate() {
    this.router.navigateByUrl(`/private/admin/manage-threshold-templates`);
  }


}


