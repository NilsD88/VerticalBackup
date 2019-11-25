import {Component, Optional, Inject, ChangeDetectorRef} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { IThresholdTemplate } from 'src/app/models/g-threshold-template.model';
import { SeverityLevel } from 'src/app/models/g-threshold-item.model';
import { NewThresholdTemplateService } from 'src/app/services/new-threshold-templates';
import { ManageThresholdTemplatesComponent } from 'src/app/pages/admin/manage-threshold-templates/manage-threshold-templates.component';
import { AddThresholdDialogComponent } from './add-threshold/addThresholdDialog.component';

@Component({
  selector: 'pvf-manage-threshold-templates-dialog',
  templateUrl: './manage-threshold-templates.component.html',
  styleUrls: ['./manage-threshold-templates.component.scss']
})
export class ManageThresholdTemplatesDialogComponent extends ManageThresholdTemplatesComponent {

  public thresholdTemplateFormGroup: FormGroup;
  public thresholdTemplate: IThresholdTemplate;
  public severities = Object.keys(SeverityLevel);
  public editMode = false;
  public fromPopup = false;


  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() private dialogRef: MatDialogRef<ManageThresholdTemplatesComponent>,
    public changeDetectorRef: ChangeDetectorRef,
    public formBuilder: FormBuilder,
    public newThresholdTemplateService: NewThresholdTemplateService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
      super(
        changeDetectorRef,
        formBuilder,
        newThresholdTemplateService,
        router,
        activeRoute,
        dialog,
      );
  }

  createThresholdTemplateCallback(result) {
    this.dialogRef.close(result);
  }

  public addThresholdDialogRef() {
    return this.dialog.open(AddThresholdDialogComponent, {
      width: '90vw'
    });
  }

}
