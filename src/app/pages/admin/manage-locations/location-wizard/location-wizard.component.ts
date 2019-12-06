import { IField } from './../../../../models/field.model';
import { ILocation } from 'src/app/models/g-location.model';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { ActivatedRoute, Router } from '@angular/router';
import { NewLocationService } from 'src/app/services/new-location.service';
import { MatStepper } from '@angular/material/stepper';
import { compareTwoObjectOnSpecificProperties } from 'src/app/shared/utils';
import { cloneDeep } from 'lodash';
import { GraphQLError } from 'graphql';
import { DialogComponent } from 'projects/ngx-proximus/src/lib/dialog/dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'pvf-location-wizard',
  templateUrl: './location-wizard.component.html',
  styleUrls: ['./location-wizard.component.scss']
})
export class LocationWizardComponent implements OnInit {

  @ViewChild('stepper', {static: false}) stepper: MatStepper;

  private originalLocation: ILocation;

  public descriptionFormGroup: FormGroup;
  public location: ILocation;
  public editMode = false;
  public canLoadLocationExplorer = false;
  public fields: IField[] = [];

  constructor(
    public formBuilder: FormBuilder,
    public changeDetectorRef: ChangeDetectorRef,
    public activatedRoute: ActivatedRoute,
    public newLocationService: NewLocationService,
    public dialog: MatDialog,
    public router: Router,
  ) {}

  async ngOnInit() {

    const locationId = this.activatedRoute.snapshot.params.id;
    const parentId =  this.getParentId();

    this.descriptionFormGroup = this.formBuilder.group({
      NameCtrl: ['', Validators.required],
      DescriptionCtrl: ['', null],
    });

    this.fields = await this.newLocationService.getCustomFields().toPromise();

    if (!isNullOrUndefined(locationId) && locationId !== 'new') {
      try {
        this.location = await this.newLocationService.getLocationById(locationId).toPromise();
        this.editMode = true;
        this.originalLocation = cloneDeep(this.location);
      } catch (err) {
        await this.resetLocation(parentId);
      }
    } else {
      await this.resetLocation(parentId);
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
      customFields: {}
    };
    if (!isNullOrUndefined(parentId)) {
      this.location.parent = await this.newLocationService.getLocationById(parentId).toPromise();
      this.location.parentId = this.location.parent.id || null;
    }
    this.fields.forEach(field => {
      this.location.customFields[field.id] = null;
    });
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
  }

  public submit() {
    if (this.editMode) {

      // TODO: check differences between customFields object
      const includeProperties = ['name', 'description', 'geolocation', 'parentId', 'image'];
      const differences = compareTwoObjectOnSpecificProperties(this.location, this.originalLocation, includeProperties);

      const location: ILocation = {
        id: this.location.id,
      };

      for (const difference of differences) {
        location[difference] = this.location[difference];
      }

      this.newLocationService.updateLocation(location).subscribe(
        (updatedLocation: ILocation | null) => {
          if (updatedLocation) {
            this.goToManageLocation();
          }
        },
        (error) => {
          console.error(error);
          this.checkIfNameAlreadyExistAndDisplayDialog(error);
        }
      );
    } else {
     this.createLocation();
    }
  }

  public createLocation() {
    this.newLocationService.createLocation(this.location).subscribe(
      (location: ILocation | null) => {
        if (location) {
          this.goToManageLocation();
        }
      },
      (error) => {
        console.error(error);
        this.checkIfNameAlreadyExistAndDisplayDialog(error);
      }
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
            title: `${nameAlreadyUsed} already exist`,
            message: 'Please choose an other location name to be able to save it'
          }
        });
      }
    }
  }

}
