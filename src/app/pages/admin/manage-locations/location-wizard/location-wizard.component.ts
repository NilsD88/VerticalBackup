import { ILocation } from 'src/app/models/g-location.model';
import { Component, OnInit, ChangeDetectorRef, ViewChild, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IGeolocation } from 'src/app/models/asset.model';
import { isNullOrUndefined } from 'util';
import { ActivatedRoute, Router } from '@angular/router';
import { NewLocationService } from 'src/app/services/new-location.service';
import { MatStepper } from '@angular/material/stepper';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material';

import _ from 'lodash';
import { compareTwoObjectOnSpecificProperties } from 'src/app/shared/utils';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'pvf-location-wizard',
  templateUrl: './location-wizard.component.html',
  styleUrls: ['./location-wizard.component.scss']
})
export class LocationWizardComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;

  private originalLocation: ILocation;

  public descriptionFormGroup: FormGroup;
  public location: ILocation;
  public editMode = false;
  public fromPopup = false;

  public canLoadLocationExplorer = false;
  public keyValues = [];

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() private dialogRef: MatDialogRef<LocationWizardComponent>,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private activedRoute: ActivatedRoute,
    private newLocationService: NewLocationService,
    private router: Router,
  ) {}

  async ngOnInit() {


    //TODO: remove next line
    this.newLocationService.getLocationsTree().subscribe((locations: ILocation[]) => {
      console.log(locations);
    });

    const params = await this.getRouteParams();
    const locationId = params.id;
    let parentId = params.parentId;

    if (this.data) {
      if (this.data.fromPopup) {
        this.fromPopup = true;
      }
      if (this.data.parentLocation) {
        parentId = this.data.parentLocation.id;
      }
    }

    this.descriptionFormGroup = this.formBuilder.group({
      NameCtrl: ['', Validators.required],
      DescriptionCtrl: ['', null],
      TypeCtrl: ['', null],
    });


    if (!isNullOrUndefined(locationId) && locationId !== 'new') {
      this.editMode = true;
      this.location = await this.newLocationService.getLocationById(locationId).toPromise();
      this.originalLocation = cloneDeep(this.location);
      console.log(this.originalLocation);
    } else {
      this.location = {
        id: null,
        parentId: null,
        parent: null,
        description: null,
        name: null,
        image: null,
        geolocation: null
      };
      if (!isNullOrUndefined(parentId)) {
        this.location.parent = await this.newLocationService.getLocationById(parentId).toPromise();
        this.location.parentId = this.location.parent.id;
      }
    }
    this.canLoadLocationExplorer = true;
  }

  private getRouteParams(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.activedRoute.params.subscribe((params) => {
        resolve(params);
      }, reject);
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
    this.changeDetectorRef.detectChanges();
    this.location.parent = location;
    this.location.parentId = location.id;

    if (oldParentId !== this.location.parent.id) {
      this.location.geolocation = null;
    }
  }

  public submit() {
    if (this.editMode) {

      const includeProperties = ['name', 'description', 'geolocation', 'parentId', 'image'];
      const differences = compareTwoObjectOnSpecificProperties(this.location, this.originalLocation, includeProperties);

      const location: ILocation = {
        id: this.location.id,
      };

      console.log({...this.originalLocation});
      console.log({...this.location});

      for (const difference of differences) {
        location[difference] = this.location[difference];
      }

      this.newLocationService.updateLocation(location).subscribe((result: ILocation) => {
        this.goToManageLocation();
      });

      /*
      this.newLocationService.updateLocation(this.location).subscribe((result) => {
        this.goToManageLocation();
      });
      */
    } else {
      /*
      this.newLocationService.createLocation(this.location).subscribe((result) => {
        if (this.fromPopup) {
          this.dialogRef.close(result);
        } else {
          this.goToManageLocation();
        }
      });
      */

     this.newLocationService.createLocation(this.location).subscribe((location: ILocation | null) => {
       if (location) {
        this.goToManageLocation();
       }
     });
    }
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
}
