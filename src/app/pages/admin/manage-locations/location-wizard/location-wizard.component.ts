import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { INewLocation, NewLocation } from 'src/app/models/new-location';
import { IGeolocation } from 'src/app/models/asset.model';
import { isNullOrUndefined } from 'util';
import { ActivatedRoute, Router } from '@angular/router';
import { NewLocationService } from 'src/app/services/new-location.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'pvf-location-wizard',
  templateUrl: './location-wizard.component.html',
  styleUrls: ['./location-wizard.component.scss']
})
export class LocationWizardComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;

  public descriptionFormGroup: FormGroup;
  public location: INewLocation;
  public editMode = false;

  public canLoadLocationExplorer = false;
  public keyValues = [];

  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private activedRoute: ActivatedRoute,
    private newLocationService: NewLocationService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.descriptionFormGroup = this.formBuilder.group({
      NameCtrl: ['', Validators.required],
      DescriptionCtrl: ['', null],
      TypeCtrl: ['', null],
    });

    const params = await this.getRouteParams();
    const locationId = params.id;
    if (locationId) {
      this.editMode = true;
      this.location = await this.newLocationService.getLocationById(+locationId).toPromise();
      if (!isNullOrUndefined(this.location.parentId)) {
        this.location.parent = await this.newLocationService.getLocationById(+this.location.parentId).toPromise();
      }
    } else {
      this.location = {
        id: null,
        parentId: null,
        parent: null,
        description: null,
        name: null,
        locationType: null,
        sublocationsId: null,
        floorPlan: null,
        geolocation: null
      };
      if (!isNullOrUndefined(params.parentId)) {
        this.location.parent = await this.newLocationService.getLocationById(+params.parentId).toPromise();
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

  updateLocation(location: INewLocation) {
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
      this.newLocationService.updateLocation(this.location).subscribe((result) => {
        this.goToManageLocation();
      });
    } else {
      this.newLocationService.createLocation(this.location).subscribe((result) => {
        this.goToManageLocation();
      });
    }
  }

  private goToManageLocation() {
    if (!isNullOrUndefined(this.location.parentId)) {
      this.router.navigateByUrl(`/private/admin/manage-locations/${this.location.parentId}`);
    } else {
      this.router.navigateByUrl('/private/admin/manage-locations');
    }
  }
}
