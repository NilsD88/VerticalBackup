import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import {Component, OnInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {MatDialog} from '@angular/material';
import {AddThresholdComponent} from './add-threshold/add-threshold.component';
import { ISensorType } from 'src/app/models/sensor-type.model';
import { IThresholdTemplate, ThresholdTemplate } from 'src/app/models/threshold-template.model';
import { IThresholdItem, ThresholdItem, SeverityLevel } from 'src/app/models/threshold-item.model';
import { ThresholdTemplateService } from 'src/app/services/threshold-templates';
import { GraphQLError } from 'graphql';
import { DialogComponent } from 'projects/ngx-proximus/src/lib/dialog/dialog.component';
import { PopupConfirmationComponent } from 'projects/ngx-proximus/src/lib/popup-confirmation/popup-confirmation.component';

@Component({
  selector: 'pvf-manage-threshold-templates',
  templateUrl: './manage-threshold-templates.component.html',
  styleUrls: ['./manage-threshold-templates.component.scss']
})
export class ManageThresholdTemplatesComponent implements OnInit, OnDestroy {

  public thresholdTemplateFormGroup: FormGroup;
  public thresholdTemplate: IThresholdTemplate;
  public severities = Object.keys(SeverityLevel);
  public editMode = false;
  public fromPopup = false;

  private subs = new SubSink();

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public formBuilder: FormBuilder,
    public thresholdTemplateService: ThresholdTemplateService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public dialog: MatDialog,
    public translateService: TranslateService,
  ) {}

  async ngOnInit() {
    const thresholdTemplateId = await this.getRouteId();
    if (!isNullOrUndefined(thresholdTemplateId)) {
      this.editMode = true;
      this.thresholdTemplate = await this.thresholdTemplateService.getThresholdTemplateById(thresholdTemplateId).toPromise();
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

  private createFormControlForItem(thresholdId: string) {
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
    let thresholdItem: IThresholdItem;
    if (threshold.sensorType.type === 'BOOLEAN') {
      thresholdItem = new ThresholdItem({
        id: new Date().getTime().toString(),
        range: {from: 1, to: 1},
        severity: SeverityLevel.LOW,
        notification: {
          web: false,
          sms: false,
          mail: false
        }
      });
    } else {
      thresholdItem = new ThresholdItem({
        id: new Date().getTime().toString(),
        range: {from: threshold.sensorType.min, to: threshold.sensorType.max},
        severity: SeverityLevel.LOW,
        notification: {
          web: false,
          sms: false,
          mail: false
        }
      });
    }
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

  public deleteThresholdItem(thresholdId: string, thresholdItemId: string) {
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
    const ref = this.addThresholdDialogRef();
    ref.afterClosed().subscribe((result: ISensorType) => {
      if (result) {
        if (!this.thresholdTemplate.thresholds.find((threshold) => {
          return threshold.sensorType.id === result.id;
        })) {
          this.thresholdTemplate.thresholds.push({
            sensorType: result,
            thresholdItems: []
          });
          this.createFormControlForItem(result.id);
        }
      }
    });
  }

  public addThresholdDialogRef() {
    return this.dialog.open(AddThresholdComponent, {
      minWidth: '320px',
      maxWidth: '400px',
      width: '100vw',
      maxHeight: '80vh',
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
    for (const threshold of this.thresholdTemplate.thresholds) {
      if (threshold.sensorType.type === 'BOOLEAN') {
        for (const thresholdItem of threshold.thresholdItems) {
          const value = +thresholdItem.range.to;
          thresholdItem.range.from = value;
          thresholdItem.range.to = value;
        }
      }
    }

    if (this.editMode) {
      if (this.thresholdTemplate.hasAssetsAttached) {
        this.dialog.open(PopupConfirmationComponent, {
          data: {
            title: this.translateService.instant('GENERAL.WARNING'),
            content: this.translateService.instant('DIALOGS.DELETE.ARE_YOU_SURE_ASSETS_ARE_USING_THIS_TEMPLATE')
          },
          minWidth: '320px',
          maxWidth: '400px',
          width: '100vw',
          maxHeight: '80vh',
        }).afterClosed().subscribe(
          result => {
            if (result) {
              this.updateThresholdTemplate();
            }
          }
        );
      } else {
        this.updateThresholdTemplate();
      }
    } else {
      this.subs.add(
        this.thresholdTemplateService.createThresholdTemplate(this.thresholdTemplate).subscribe(
          (result) => {
            this.createThresholdTemplateCallback(result);
          },
          (error) => {
            console.error(error);
            this.checkIfNameAlreadyExistAndDisplayDialog(error);
          }
        )
      );
    }
  }

  private updateThresholdTemplate() {
    this.subs.add(
      this.thresholdTemplateService.updateThresholdTemplate(this.thresholdTemplate).subscribe(
        () => {
          this.goToManageThresholdTemplate();
        },
        (error) => {
          console.error(error);
          this.checkIfNameAlreadyExistAndDisplayDialog(error);
        }
      )
    );
  }

  createThresholdTemplateCallback(result) {
    this.goToManageThresholdTemplate();
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
            title: `${nameAlreadyUsed} ${this.translateService.instant('DIALOGS.FAILS.ALREADY_EXISTS')}`,
            message: this.translateService.instant('DIALOGS.FAILS.CHOOSE_AN_OTHER_THRESHOLD_TEMPLATE_NAME')
          },
          minWidth: '320px',
          maxWidth: '400px',
          width: '100vw',
          maxHeight: '80vh',
        });
      }
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}

