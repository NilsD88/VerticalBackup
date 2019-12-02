import { PointOfAttentionService } from 'src/app/services/point-of-attention.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IPointOfAttention } from './../../../../models/point-of-attention.model';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import {cloneDeep} from 'lodash';
import { ILocation } from 'src/app/models/g-location.model';
import { MatDialog } from '@angular/material';
import { LocationWizardDialogComponent } from '../../manage-locations/location-wizard/locationWizardDialog.component';
import { compareTwoObjectOnSpecificProperties } from 'src/app/shared/utils';

@Component({
  selector: 'pvf-point-of-attention-wizard',
  templateUrl: './point-of-attention-wizard.component.html',
  styleUrls: ['./point-of-attention-wizard.component.scss']
})
export class PointOfAttentionWizardComponent implements OnInit {

  public pointOfAttention: IPointOfAttention;
  private originalPointOfAttention: IPointOfAttention;
  public editMode = false;
  public descriptionFormGroup: FormGroup;

  public displayLocationExplorer = true;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private pointOfAttentionService: PointOfAttentionService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
  ) { }

  async ngOnInit() {
    this.descriptionFormGroup = this.formBuilder.group({
      NameCtrl: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      DescriptionCtrl: ['', null],
    });

    const pointOfAttentionId = this.activatedRoute.snapshot.params.id;
    if (!isNullOrUndefined(pointOfAttentionId) && pointOfAttentionId !== 'new') {
      this.editMode = true;
      this.pointOfAttention = await this.pointOfAttentionService.getPointOfAttentionById(pointOfAttentionId).toPromise();
      this.originalPointOfAttention = cloneDeep(this.originalPointOfAttention);
      this.originalPointOfAttention.locationId = this.originalPointOfAttention.location.id;
    } else {
      this.pointOfAttention = {
        id: null,
        name: null,
        location: null,
        locationId: null,
        items: []
      };
    }
  }

  public updateLocation(location: ILocation) {
    if (location) {
      this.pointOfAttention.location = null;
      this.changeDetectorRef.detectChanges();
      this.pointOfAttention.location = location;
      this.pointOfAttention.locationId = location.id;
    }
  }

  // POPUPS

  public async openAddLocation() {
    const dialogRef = this.dialog.open(LocationWizardDialogComponent, {
      minWidth: '320px',
      maxWidth: '1024px',
      width: '100vw',
      data: {
        parentLocation: this.pointOfAttention.location,
        fromPopup: true,
      }
    });
    const result: ILocation = await dialogRef.afterClosed().toPromise();
    if (result) {
      this.displayLocationExplorer = false;
      this.changeDetectorRef.detectChanges();
      this.pointOfAttention.location = result;
      this.displayLocationExplorer = true;
    }
  }

  public save() {

    if (this.editMode) {
      const pointOfAttention: IPointOfAttention  = {
        id: this.pointOfAttention.id,
      };
      const includeProperties = ['name', 'description', 'locationId'];
      const differences = compareTwoObjectOnSpecificProperties(this.pointOfAttention, this.originalPointOfAttention, includeProperties);
      for (const difference of differences) {
        pointOfAttention[difference] = this.pointOfAttention[difference];
      }

      // TODO: check differences for items
    }

    console.log(this.pointOfAttention);
  }



}
