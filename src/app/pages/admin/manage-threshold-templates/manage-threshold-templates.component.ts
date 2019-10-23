import {Component, OnInit, Optional, Inject, ChangeDetectorRef} from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {MatDialog} from '@angular/material';
import {AddThresholdComponent} from './add-threshold/add-threshold.component';
import { ISensorType } from 'src/app/models/g-sensor-type.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { IThresholdTemplate, ThresholdTemplate } from 'src/app/models/g-threshold-template.model';
import { IThresholdItem, ThresholdItem, SeverityLevel } from 'src/app/models/g-threshold-item.model';
import { NewThresholdTemplateService } from 'src/app/services/new-threshold-templates';
import { GraphQLError } from 'graphql';
import { DialogComponent } from 'projects/ngx-proximus/src/lib/dialog/dialog.component';

@Component({
  selector: 'pvf-manage-threshold-templates',
  templateUrl: './manage-threshold-templates.component.html',
  styleUrls: ['./manage-threshold-templates.component.scss']
})
export class ManageThresholdTemplatesComponent implements OnInit {

  public thresholdTemplateFormGroup: FormGroup;
  public thresholdTemplate: IThresholdTemplate;
  public severities = Object.keys(SeverityLevel);
  public editMode = false;
  public fromPopup = false;


  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() private dialogRef: MatDialogRef<ManageThresholdTemplatesComponent>,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private newThresholdTemplateService: NewThresholdTemplateService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    const thresholdTemplateId = await this.getRouteId();

    if (this.data) {
      if (this.data.fromPopup) {
        this.fromPopup = true;
      }
    }

    if (!isNullOrUndefined(thresholdTemplateId)) {
      this.editMode = true;
      this.thresholdTemplate = await this.newThresholdTemplateService.getThresholdTemplateById(thresholdTemplateId).toPromise();
      this.thresholdTemplateFormGroup = this.formBuilder.group({
        name: ['', Validators.compose([Validators.required, Validators.pattern('[A-zÀ-ú0-9 ]*')])],
      });
      for (const threshold of this.thresholdTemplate.thresholds) {
        const sensorId = threshold.sensorType.id;
        this.thresholdTemplateFormGroup.addControl(`threshold-${sensorId}`, this.formBuilder.group({
          thresholdItems: this.formBuilder.group({})
        }));
        for (const thresholdItem of threshold.thresholdItems) {
          switch (threshold.sensorType.type) {
            case 'NUMBER':
              this.createFormControlForNumberItem(sensorId, thresholdItem.id);
              break;
            case 'COUNTER':
              this.createFormControlForCounterItem(sensorId, thresholdItem.id);
              break;
            case 'BOOLEAN':
              this.createFormControlForBooleanItem(sensorId, thresholdItem.id);
              break;
          }
        }
      }
    } else {
      this.thresholdTemplate = new ThresholdTemplate();
      this.thresholdTemplateFormGroup = this.formBuilder.group({
        name: ['', Validators.compose([Validators.required, Validators.pattern('[A-zÀ-ú0-9 ]*')])],
      });
    }
    this.changeDetectorRef.detectChanges();
  }

  private createFormControlForItem(thresholdId: number) {
    this.thresholdTemplateFormGroup.addControl(`threshold-${thresholdId}`, this.formBuilder.group({
      thresholdItems: this.formBuilder.group({})
    }));
  }

  private createFormControlForNumberItem(thresholdId, thresholdItemId) {
    const thresholdControl: AbstractControl = this.thresholdTemplateFormGroup.get(`threshold-${thresholdId}`);
    if (thresholdControl instanceof FormGroup) {
      const thresholdItemControl: AbstractControl = thresholdControl.get(`thresholdItems`);
      if (thresholdItemControl instanceof FormGroup) {
        (thresholdItemControl as FormGroup).addControl(thresholdItemId, this.formBuilder.group({
          severity: ['', Validators.required],
          label: ['', null],
          notification: this.formBuilder.group({
            web: ['', Validators.required],
            mail: ['', Validators.required],
            sms: ['', Validators.required],
          })
        }));
      }
    }
  }

  private createFormControlForCounterItem(thresholdId, thresholdItemId) {
    const thresholdControl: AbstractControl = this.thresholdTemplateFormGroup.get(`threshold-${thresholdId}`);
    if (thresholdControl instanceof FormGroup) {
      const thresholdItemControl: AbstractControl = thresholdControl.get(`thresholdItems`);
      if (thresholdItemControl instanceof FormGroup) {
        (thresholdItemControl as FormGroup).addControl(thresholdItemId, this.formBuilder.group({
          severity: ['', Validators.required],
          label: ['', null],
          notification: this.formBuilder.group({
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

  private createFormControlForBooleanItem(thresholdId, thresholdItemId) {
    const thresholdControl: AbstractControl = this.thresholdTemplateFormGroup.get(`threshold-${thresholdId}`);
    if (thresholdControl instanceof FormGroup) {
      const thresholdItemControl: AbstractControl = thresholdControl.get(`thresholdItems`);
      if (thresholdItemControl instanceof FormGroup) {
        (thresholdItemControl as FormGroup).addControl(thresholdItemId, this.formBuilder.group({
          severity: ['', Validators.required],
          label: ['', null],
          notification: this.formBuilder.group({
            web: ['', Validators.required],
            mail: ['', Validators.required],
            sms: ['', Validators.required],
          }),
          boolean: ['', Validators.required],
        }));
      }
    }
  }

  public addThresholdItem(thresholdId: string) {

    const threshold = this.thresholdTemplate.thresholds.find((elt) => elt.sensorType.id === thresholdId);

    const thresholdItem = new ThresholdItem({
      id: new Date().getTime().toString(),
      range: {from: threshold.sensorType.min, to: threshold.sensorType.max},
      severity: SeverityLevel.LOW,
      notification: {
        web: false,
        sms: false,
        mail: false
      }
    });
    threshold.thresholdItems.push(thresholdItem);
    switch (threshold.sensorType.type) {
      case 'NUMBER':
          this.createFormControlForNumberItem(thresholdId, thresholdItem.id);
          break;
      case 'COUNTER':
          this.createFormControlForCounterItem(thresholdId, thresholdItem.id);
          break;
      case 'BOOLEAN':
          this.createFormControlForBooleanItem(thresholdId, thresholdItem.id);
          break;
    }
  }

  public deleteThresholdItem(thresholdId, thresholdItemId) {
    const findSensorIndex = this.thresholdTemplate.thresholds.findIndex((elt) => elt.sensorType.id === thresholdId);
    const findThresholdIndex = this.thresholdTemplate.thresholds[findSensorIndex].thresholdItems.findIndex((elt) => elt.id === thresholdItemId);
    this.thresholdTemplate.thresholds[findSensorIndex].thresholdItems.splice(findThresholdIndex, 1);
    const thresholdControl: AbstractControl = this.thresholdTemplateFormGroup.get(`threshold-${thresholdId}`);
    if (thresholdControl instanceof FormGroup) {
      const thresholdItemControl: AbstractControl = thresholdControl.get(`thresholdItems`);
      if (thresholdItemControl instanceof FormGroup) {
        thresholdItemControl.removeControl(thresholdItemId);
      }
    }
  }

  public deleteThreshold(thresholdId) {
    const findSensorIndex = this.thresholdTemplate.thresholds.findIndex((elt) => elt.sensorType.id === thresholdId);
    this.thresholdTemplate.thresholds.splice(findSensorIndex, 1);
    this.thresholdTemplateFormGroup.removeControl(`threshold-${thresholdId}`);
  }

  public changeRange(thresholdItem: IThresholdItem, event: [number, number]) {
    thresholdItem.range.from = event[0];
    thresholdItem.range.to = event[1];
  }

  public addThreshold() {
    const ref = this.dialog.open(AddThresholdComponent, {
      width: '90vw'
    });
    ref.afterClosed().subscribe((result: ISensorType) => {
      if (result) {
        console.log({...this.thresholdTemplate});
        console.log({...result});
        if (!this.thresholdTemplate.thresholds.find((threshold) => {
          console.log({...threshold});
          console.log({...result});
          return threshold.sensorType.id === result.id;
        })) {
          this.thresholdTemplate.thresholds.push({
            sensorType: result,
            thresholdItems: []
          });
          this.createFormControlForItem(+result.id);
        }
      }
    });
  }

  private getRouteId(): Promise<string> {
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

    console.log('SAVE THRESHOLDS');
    console.log({...this.thresholdTemplate});

    if (this.editMode) {
      this.newThresholdTemplateService.updateThresholdTemplate(this.thresholdTemplate).subscribe(
        (data) => {
          this.goToManageThresholdTemplate();
        },
        (error) => {
          console.error(error);
          this.checkIfNameAlreadyExistAndDisplayDialog(error);
        }
      );
    } else {
      this.newThresholdTemplateService.createThresholdTemplate(this.thresholdTemplate).subscribe(
        (result) => {
          if (this.fromPopup) {
            this.dialogRef.close(result);
          } else {
            this.goToManageThresholdTemplate();
          }
        },
        (error) => {
          console.error(error);
          this.checkIfNameAlreadyExistAndDisplayDialog(error);
        }
      );
    }
  }

  private goToManageThresholdTemplate() {
    this.router.navigateByUrl(`/private/admin/manage-threshold-templates`);
  }

  private checkIfNameAlreadyExistAndDisplayDialog(error) {
    const graphQLErrors: GraphQLError = error.graphQLErrors;
    const errorExtensions = graphQLErrors[0].extensions;
    if (errorExtensions) {
      const nameAlreadyUsed = errorExtensions.thresholdTemplateNameNotUnique;
      if (nameAlreadyUsed) {
        this.dialog.open(DialogComponent, {
          data: {
            title: `${nameAlreadyUsed} already exist`,
            message: 'Please choose an other threshold template name to be able to save it'
          }
        });
      }
    }
  }

}

