import { StairwayToHealthLocationService } from './../../../services/stairway-to-health/location.service';
import { SubSink } from 'subsink';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { IPeopleCountingAsset } from 'src/app/models/peoplecounting/asset.model';
import { ILocation } from 'src/app/models/g-location.model';
import { Component, OnInit, ChangeDetectorRef, ViewChild, Optional, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { ActivatedRoute, Router } from '@angular/router';
import { NewLocationService } from 'src/app/services/new-location.service';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material';
import { compareTwoObjectOnSpecificProperties } from 'src/app/shared/utils';
import { cloneDeep } from 'lodash';
import { LocationWizardDialogComponent } from 'src/app/pages/admin/manage-locations/location-wizard/locationWizardDialog.component';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IAsset } from 'src/app/models/g-asset.model';
import { IField } from 'src/app/models/field.model';
import { PeopleCountingAssetWizardDialogComponent } from 'src/app/shared/people-counting/asset-wizard/assetWizardDialog.component';
import { GraphQLError } from 'graphql/error';
import { DialogComponent } from 'projects/ngx-proximus/src/lib/dialog/dialog.component';

@Component({
  selector: 'pvf-place-wizard',
  templateUrl: './place-wizard.component.html',
  styleUrls: ['./place-wizard.component.scss']
})
export class PlaceWizardComponent implements OnInit, OnDestroy {

  @ViewChild('stepper', {static: false}) stepper: MatStepper;

  public isNullOrUndefined = isNullOrUndefined;
  public descriptionFormGroup: FormGroup;
  public location: IPeopleCountingLocation;
  public editMode = false;
  public displayLocationExplorer = false;
  public fields: IField[];
  public assets = [];
  public isSavingOrUpdating: boolean;

  private originalLocation: IPeopleCountingLocation;
  private assetsRequest$ = new Subject();
  private subs = new SubSink();


  constructor(
    public formBuilder: FormBuilder,
    public changeDetectorRef: ChangeDetectorRef,
    public activatedRoute: ActivatedRoute,
    public newLocationService: NewLocationService,
    public peopleCountingRetailLocationService: StairwayToHealthLocationService,
    public assetService: NewAssetService,
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

    this.subs.add(
      this.assetsRequest$.pipe(
        switchMap(() => {
          return this.assetService.getAssetsByLocationId(this.location.id);
        })
      ).subscribe((assets: IAsset[]) => {
        this.location.assets = assets;
        this.changeDetectorRef.detectChanges();
      })
    );

    if (!isNullOrUndefined(locationId) && locationId !== 'new') {
      try {
        this.location = await this.newLocationService.getLocationById(locationId).toPromise();
        this.assetsRequest$.next();
        this.editMode = true;
        this.originalLocation = cloneDeep(this.location);
      } catch (err) {
        await this.resetLocation(parentId);
      }
    } else {
      await this.resetLocation(parentId);
    }
    this.displayLocationExplorer = true;
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
      customFields: [],
      module: 'PEOPLE_COUNTING_RETAIL'
    };
    if (!isNullOrUndefined(parentId)) {
      this.location.parent = await this.newLocationService.getLocationById(parentId).toPromise();
      this.location.parentId = this.location.parent.id || null;
    }
  }

  updateLocation(location: IPeopleCountingLocation) {
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

  public submitAndContinue() {
    this.isSavingOrUpdating = true;
    if (this.editMode || !isNullOrUndefined(this.location.id)) {
      const includeProperties = ['name', 'description', 'geolocation', 'parentId', 'image', 'customFields'];
      const differences = compareTwoObjectOnSpecificProperties(this.location, this.originalLocation, includeProperties);

      const location: IPeopleCountingLocation = {
        id: this.location.id,
      };

      for (const difference of differences) {
        location[difference] = this.location[difference];
      }

      this.subs.add(
        this.peopleCountingRetailLocationService.updateLocation(location).subscribe(
          (updatedLocation: ILocation | null) => {
            if (updatedLocation) {
              this.originalLocation = cloneDeep(location);
              this.stepper.next();
            }
            this.isSavingOrUpdating = false;
          },
          (error) => {
            console.error(error);
            this.checkIfNameAlreadyExistAndDisplayDialog(error);
            this.isSavingOrUpdating = false;
          }
        )
      );
    } else {
      this.subs.add(
        this.peopleCountingRetailLocationService.createLocation(this.location).subscribe(
          (location: IPeopleCountingLocation | null) => {
            this.location.id = location.id;
            this.originalLocation = cloneDeep(location);
            this.changeDetectorRef.detectChanges();
            this.stepper.next();
            console.log(this.location);
            this.isSavingOrUpdating = false;
          },
          (error) => {
            console.error(error);
            this.checkIfNameAlreadyExistAndDisplayDialog(error);
            this.isSavingOrUpdating = false;
          }
        )
      );
    }
  }

  public done() {
    if (this.editMode) {
      this.isSavingOrUpdating = true;
      const includeProperties = ['name', 'description', 'geolocation', 'parentId', 'image', 'customFields'];
      const differences = compareTwoObjectOnSpecificProperties(this.location, this.originalLocation, includeProperties);

      const location: IPeopleCountingLocation = {
        id: this.location.id,
      };

      for (const difference of differences) {
        location[difference] = this.location[difference];
      }

      this.subs.add(
        this.peopleCountingRetailLocationService.updateLocation(location).subscribe(
          (updatedLocation: ILocation | null) => {
            if (updatedLocation) {
              this.goToPlacePage(this.location.id);
            }
            this.isSavingOrUpdating = false;
          },
          (error) => {
            console.error(error);
            this.checkIfNameAlreadyExistAndDisplayDialog(error);
            this.isSavingOrUpdating = false;
          }
        )
      );
    } else {
      this.goToPlacePage(this.location.id);
    }
  }


  private goToPlacePage(locationId: string) {
    this.router.navigateByUrl(`/private/peoplecounting/place/${locationId}`);
  }


  public addImage() {
    this.location.images.push(null);
  }

  public removeImage(index) {
    this.location.images.splice(index, 1);
    this.changeDetectorRef.detectChanges();
  }

  // POPUPS


  public async openAddAsset() {
    const dialogRef = this.dialog.open(PeopleCountingAssetWizardDialogComponent, {
      minWidth: '320px',
      maxWidth: '1024px',
      width: '100vw',
      maxHeight: '80vh',
      data: {
        location: this.location,
        module: 'PEOPLE_COUNTING_STAIRWAY_TO_HEALTH'
      }
    });
    const result: IPeopleCountingAsset = await dialogRef.afterClosed().toPromise();
    if (result) {
      this.assetsRequest$.next();
    }
  }

  public async openAddLocation() {
    const dialogRef = this.dialog.open(LocationWizardDialogComponent, {
      minWidth: '320px',
      maxWidth: '1024px',
      width: '100vw',
      maxHeight: '80vh',
      data: {
        parentLocation: this.location.parent,
        fromPopup: true,
      }
    });
    const result: ILocation = await dialogRef.afterClosed().toPromise();
    if (result) {
      this.displayLocationExplorer = false;
      this.changeDetectorRef.detectChanges();
      this.location.parent = result;
      this.displayLocationExplorer = true;
    }
  }

  private checkIfNameAlreadyExistAndDisplayDialog(error) {
    const graphQLErrors: GraphQLError = error.graphQLErrors;
    const errorExtensions = graphQLErrors[0].extensions;
    if (errorExtensions) {
      const nameAlreadyUsed = errorExtensions.locationNameNotUnique;
      if (nameAlreadyUsed) {
        console.log('nameAlreadyUsed');
        this.dialog.open(DialogComponent, {
          data: {
            title: `${nameAlreadyUsed} already exist`,
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
    this.router.navigateByUrl('/private/peoplecounting/dashboard');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
