import { WalkingTrailAssetService } from 'src/app/services/walkingtrail/asset.service';
import { WalkingTrailLocationService } from './../../../services/walkingtrail/location.service';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { IPeopleCountingAsset } from 'src/app/models/peoplecounting/asset.model';
import { ILocation } from 'src/app/models/g-location.model';
import { Component, OnInit, ChangeDetectorRef, ViewChild, Optional, Inject } from '@angular/core';
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
  selector: 'pvf-trail-wizard',
  templateUrl: './trail-wizard.component.html',
  styleUrls: ['./trail-wizard.component.scss']
})
export class TrailWizardComponent implements OnInit {

  @ViewChild('stepper', {static: false}) stepper: MatStepper;

  private originalLocation: IPeopleCountingLocation;
  private assetsRequest$ = new Subject();

  public isNullOrUndefined = isNullOrUndefined;

  public descriptionFormGroup: FormGroup;
  public location: IPeopleCountingLocation;
  public editMode = false;
  public displayLocationExplorer = false;
  public fields: IField[] = [];
  public assets = [];


  constructor(
    public formBuilder: FormBuilder,
    public changeDetectorRef: ChangeDetectorRef,
    public activatedRoute: ActivatedRoute,
    public newLocationService: NewLocationService,
    public walkingTrailLocationService: WalkingTrailLocationService,
    public assetService: WalkingTrailAssetService,
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

    this.assetsRequest$.pipe(
      switchMap(() => {
        return this.assetService.getAssetsByLocationId(this.location.id);
      })
    ).subscribe((assets: IAsset[]) => {
      this.location.assets = assets;
      this.changeDetectorRef.detectChanges();
    });

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
      images: [],
      geolocation: null,
      customFields: [],
      module: 'WALKING_TRAIL'
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
    if (this.editMode || !isNullOrUndefined(this.location.id)) {
      const includeProperties = ['name', 'description', 'geolocation', 'parentId', 'image', 'images', 'customFields'];
      const differences = compareTwoObjectOnSpecificProperties(this.location, this.originalLocation, includeProperties);

      const location: IPeopleCountingLocation = {
        id: this.location.id,
      };

      for (const difference of differences) {
        location[difference] = this.location[difference];
      }

      this.walkingTrailLocationService.updateLocation(location).subscribe(
        (updatedLocation: ILocation | null) => {
          if (updatedLocation) {
            this.originalLocation = cloneDeep(location);
            this.stepper.next();
          }
        },
        (error) => {
          console.error(error);
          this.checkIfNameAlreadyExistAndDisplayDialog(error);
        }
      );
    } else {
      this.walkingTrailLocationService.createLocation(this.location).subscribe(
        (location: IPeopleCountingLocation | null) => {
          this.location.id = location.id;
          this.originalLocation = cloneDeep(location);
          this.changeDetectorRef.detectChanges();
          this.stepper.next();
          console.log(this.location);
        },
        (error) => {
          console.error(error);
          this.checkIfNameAlreadyExistAndDisplayDialog(error);
        }
      );
    }
  }

  public done() {
    if (this.editMode) {
      const includeProperties = ['name', 'description', 'geolocation', 'parentId', 'image', 'images', 'customFields'];
      const differences = compareTwoObjectOnSpecificProperties(this.location, this.originalLocation, includeProperties);

      const location: IPeopleCountingLocation = {
        id: this.location.id,
      };

      for (const difference of differences) {
        location[difference] = this.location[difference];
      }

      this.walkingTrailLocationService.updateLocation(location).subscribe(
        (updatedLocation: ILocation | null) => {
          if (updatedLocation) {
            this.goToTrailPage(this.location.id);
          }
        },
        (error) => {
          console.error(error);
          this.checkIfNameAlreadyExistAndDisplayDialog(error);
        }
      );
    } else {
      this.goToTrailPage(this.location.id);
    }
  }


  private goToTrailPage(locationId: string) {
    this.router.navigateByUrl(`/private/walkingtrail/trail/${locationId}`);
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
        module: 'PEOPLE_COUNTING_WALKING_TRAIL'
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


}
