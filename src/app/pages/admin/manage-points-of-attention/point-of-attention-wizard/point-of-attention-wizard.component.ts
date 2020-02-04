import { NewLocationService } from './../../../../services/new-location.service';
import { SubSink } from 'subsink';
import { PointOfAttentionService } from 'src/app/services/point-of-attention.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IPointOfAttention, IPointOfAttentionItem } from './../../../../models/point-of-attention.model';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import {cloneDeep} from 'lodash';
import { ILocation } from 'src/app/models/g-location.model';
import { MatDialog } from '@angular/material';
import { LocationWizardDialogComponent } from '../../manage-locations/location-wizard/locationWizardDialog.component';
import { compareTwoObjectOnSpecificProperties, findLocationById } from 'src/app/shared/utils';
import { GraphQLError } from 'graphql';
import { DialogComponent } from 'projects/ngx-proximus/src/lib/dialog/dialog.component';

@Component({
  selector: 'pvf-point-of-attention-wizard',
  templateUrl: './point-of-attention-wizard.component.html',
  styleUrls: ['./point-of-attention-wizard.component.scss']
})
export class PointOfAttentionWizardComponent implements OnInit, OnDestroy {

  public pointOfAttention: IPointOfAttention;
  public editMode = false;
  public descriptionFormGroup: FormGroup;
  public displayLocationExplorer = true;
  public isSavingOrUpdating: boolean;

  private originalPointOfAttention: IPointOfAttention;
  private subs = new SubSink();

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private pointOfAttentionService: PointOfAttentionService,
    private locationService: NewLocationService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router
  ) { }

  async ngOnInit() {
    this.descriptionFormGroup = this.formBuilder.group({
      NameCtrl: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      DescriptionCtrl: ['', null],
    });

    const pointOfAttentionId = this.activatedRoute.snapshot.params.id;
    if (!isNullOrUndefined(pointOfAttentionId) && pointOfAttentionId !== 'new') {
      this.editMode = true;
      const pointOfAttention = await this.pointOfAttentionService.getPointOfAttentionById(pointOfAttentionId).toPromise();
      this.originalPointOfAttention = cloneDeep(pointOfAttention);
      this.originalPointOfAttention.locationId = this.originalPointOfAttention.location.id;
      // Need to get the location tree of the location for adding an asset
      const locationTree = await this.locationService.getLocationsTree().toPromise();
      pointOfAttention.location = findLocationById(
        { children: locationTree },
        pointOfAttention.location.id
      ).location;
      this.pointOfAttention = pointOfAttention;
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
    const oldSelectedLocation = this.pointOfAttention.location;
    if (location && location !== oldSelectedLocation) {
      this.pointOfAttention.location = null;
      this.changeDetectorRef.detectChanges();
      if (location.id) {
        this.pointOfAttention.location = location;
        this.pointOfAttention.locationId = location.id;
      }
    }
  }

  // POPUPS

  public async openAddLocation() {
    const dialogRef = this.dialog.open(LocationWizardDialogComponent, {
      minWidth: '320px',
      maxWidth: '1024px',
      maxHeight: '80vh',
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
    this.isSavingOrUpdating = true;
    if (this.editMode) {
      const pointOfAttention: IPointOfAttention  = {
        id: this.pointOfAttention.id,
      };
      const includeProperties = ['name', 'description', 'locationId'];
      const differences = compareTwoObjectOnSpecificProperties(this.pointOfAttention, this.originalPointOfAttention, includeProperties);
      for (const difference of differences) {
        pointOfAttention[difference] = this.pointOfAttention[difference];
      }
      pointOfAttention.items = this.pointOfAttention.items.map((item: IPointOfAttentionItem) => {
        const cleanedItem: IPointOfAttentionItem = {
          name: item.name,
          sensorTypeId: item.sensorType.id,
          aggregationType: item.aggregationType,
          assetIds: item.assets.map(asset => asset.id)
        };
        return cleanedItem;
      });

      this.subs.sink = this.pointOfAttentionService.updatePointOfAttention(pointOfAttention).subscribe(
        () => {
          this.isSavingOrUpdating = false;
          this.goToManagePointsOfAttention();
        },
        (error) => {
          console.error(error);
          this.checkIfNameAlreadyExistAndDisplayDialog(error);
          this.isSavingOrUpdating = false;
        }
      );
    } else {
      this.subs.sink = this.pointOfAttentionService.createPointOfAttention(this.pointOfAttention).subscribe(
        () => {
          this.isSavingOrUpdating = false;
          this.goToManagePointsOfAttention();
        },
        (error) => {
          console.error(error);
          this.checkIfNameAlreadyExistAndDisplayDialog(error);
          this.isSavingOrUpdating = false;
        }
      );
    }
  }

  private goToManagePointsOfAttention() {
    this.router.navigateByUrl(`/private/admin/manage-points-of-attention`);
  }


  private checkIfNameAlreadyExistAndDisplayDialog(error) {
    const graphQLErrors: GraphQLError = error.graphQLErrors;
    const errorExtensions = graphQLErrors[0].extensions;
    if (errorExtensions) {
      const nameAlreadyUsed = errorExtensions.thresholdTemplateNameNotUnique;
      if (nameAlreadyUsed) {
        this.dialog.open(DialogComponent, {
          data: {
            title: `${nameAlreadyUsed} already exists`,
            message: 'Please choose an other threshold template name to be able to save it'
          },
          minWidth: '320px',
          maxWidth: '400px',
          width: '100vw',
          maxHeight: '80vh',
        });
      }
    }
  }

  public cancelWizard() {
    this.router.navigateByUrl('private/admin/manage-points-of-attention');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
