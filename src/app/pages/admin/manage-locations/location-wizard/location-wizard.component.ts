import { SubSink } from 'subsink';
import { IField } from './../../../../models/field.model';
import { ILocation } from 'src/app/models/location.model';
import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from 'src/app/services/location.service';
import { MatStepper } from '@angular/material/stepper';
import { compareTwoObjectOnSpecificProperties } from 'src/app/shared/utils';
import { cloneDeep } from 'lodash';
import { GraphQLError } from 'graphql';
import { DialogComponent } from 'projects/ngx-proximus/src/lib/dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { IPopupConfirmation } from 'projects/ngx-proximus/src/lib/popup-confirmation/popup-confirmation.component';

@Component({
  selector: 'pvf-location-wizard',
  templateUrl: './location-wizard.component.html',
  styleUrls: ['./location-wizard.component.scss']
})
export class LocationWizardComponent implements OnInit, OnDestroy {

  @ViewChild('stepper', {static: false}) stepper: MatStepper;

  public descriptionFormGroup: FormGroup;
  public location: ILocation;
  public editMode = false;
  public canLoadLocationExplorer = false;
  public fields: IField[];
  public isSavingOrUpdating: boolean;
  public showCancel = true;
  public subs = new SubSink();

  public changeFloorPlanConfirmationMessage: IPopupConfirmation = {
    title: 'Warning',
    content: 'Pay attention if you replace the floor plan, the sub-locations and assets would need to be re-positioned on the new floorplan image, do you want to proceed?',
    continueButton: 'Yes',
    cancelButton: 'No'
  };

  private parentIdParam: string;
  private originalLocation: ILocation;

  constructor(
    public formBuilder: FormBuilder,
    public changeDetectorRef: ChangeDetectorRef,
    public activatedRoute: ActivatedRoute,
    public locationService: LocationService,
    public dialog: MatDialog,
    public router: Router,
  ) {
  }

  async ngOnInit() {

    const locationId = this.activatedRoute.snapshot.params.id;
    this.parentIdParam = this.getParentId();

    this.descriptionFormGroup = this.formBuilder.group({
      NameCtrl: ['', Validators.required],
      DescriptionCtrl: ['', null],
    });

    this.fields = await this.locationService.getCustomFields().toPromise();
    if (!isNullOrUndefined(locationId) && locationId !== 'new') {
      try {
        this.location = await this.locationService.getLocationById(locationId).toPromise();
        this.editMode = true;
        this.originalLocation = cloneDeep(this.location);
      } catch (err) {
        await this.resetLocation(this.parentIdParam);
      }
    } else {
      await this.resetLocation(this.parentIdParam);
    }
    this.canLoadLocationExplorer = true;
  }

  getParentId() {
    return this.activatedRoute.snapshot.params.parentId;
  }

  private async resetLocation(parentId) {
    this.location = {
      id: null,
      parentId: null,
      parent: null,
      description: null,
      name: null,
      image: null,
      geolocation: null,
      customFields: []
    };
    if (!isNullOrUndefined(parentId) && parentId !== 'root') {
      this.location.parent = await this.locationService.getLocationById(parentId).toPromise();
      this.location.parentId = this.location.parent.id || null;
      this.changeDetectorRef.detectChanges();
      this.parentIdParam = null;
      this.stepper.next();
    }
  }

  updateLocation(location: ILocation) {
    let oldParentId = null;
    if (this.location.parent) {
      if (this.location.parent.id) {
        oldParentId = this.location.parent.id;
      }
    }

    this.location.parent = null;
    this.location.parentId = null;
    this.changeDetectorRef.detectChanges();
    this.location.parent = location;
    this.location.parentId = location.id || null;

    if (oldParentId !== this.location.parent.id) {
      this.location.geolocation = null;
    }

    if (!isNullOrUndefined(this.parentIdParam)) {
      this.changeDetectorRef.detectChanges();
      this.parentIdParam = null;
      this.stepper.next();
    }
  }

  public submit() {
    this.isSavingOrUpdating = true;
    if (this.editMode) {
      const includeProperties = ['name', 'description', 'geolocation', 'parentId', 'image', 'customFields'];
      const differences = compareTwoObjectOnSpecificProperties(this.location, this.originalLocation, includeProperties);

      const location: ILocation = {
        id: this.location.id,
      };

      for (const difference of differences) {
        location[difference] = this.location[difference];
      }

      this.subs.add(
        this.locationService.updateLocation(location).subscribe(
          (updatedLocation: ILocation | null) => {
            this.isSavingOrUpdating = false;
            if (updatedLocation) {
              this.goToManageLocation();
            }
          },
          (error) => {
            this.isSavingOrUpdating = false;
            console.error(error);
            this.checkIfNameAlreadyExistAndDisplayDialog(error);
          }
        )
      );
    } else {
      this.createLocation();
    }
  }

  public createLocation() {
    this.subs.add(
      this.locationService.createLocation(this.location).subscribe(
        (location: ILocation | null) => {
          this.isSavingOrUpdating = false;
          if (location) {
            this.goToManageLocation();
          }
        },
        (error) => {
          this.isSavingOrUpdating = false;
          console.error(error);
          this.checkIfNameAlreadyExistAndDisplayDialog(error);
        }
      )
    );
  }


  private goToManageLocation() {
    if (!isNullOrUndefined(this.location.parentId)) {
      this.router.navigateByUrl(`/private/admin/manage-locations/${this.location.parentId}`);
    } else {
      const parentId = (this.location.parent) ? this.location.parent.id : null;
      if (parentId) {
        this.router.navigateByUrl(`/private/admin/manage-locations/${parentId}`);
      } else {
        this.router.navigateByUrl('/private/admin/manage-locations');
      }
    }
  }


  private checkIfNameAlreadyExistAndDisplayDialog(error) {
    const graphQLErrors: GraphQLError = error.graphQLErrors;
    const errorExtensions = graphQLErrors[0].extensions;
    if (errorExtensions) {
      const nameAlreadyUsed = errorExtensions.locationNameNotUnique;
      if (nameAlreadyUsed) {
        this.dialog.open(DialogComponent, {
          data: {
            title: `${nameAlreadyUsed} already exists`,
            message: 'Please choose an other location name to be able to save it'
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
    this.router.navigateByUrl('private/admin/manage-locations');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }


}
