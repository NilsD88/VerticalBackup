import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import { WalkingTrailAssetService } from 'src/app/services/walkingtrail/asset.service';
import { WalkingTrailLocationService } from './../../../services/walkingtrail/location.service';
import { IPeopleCountingLocation } from 'src/app/models/peoplecounting/location.model';
import { IPeopleCountingAsset } from 'src/app/models/peoplecounting/asset.model';
import { ILocation } from 'src/app/models/location.model';
import { Component, OnInit, ChangeDetectorRef, ViewChild, Optional, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from 'src/app/services/location.service';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material';
import { compareTwoObjectOnSpecificProperties } from 'src/app/shared/utils';
import { cloneDeep, compact } from 'lodash';
import { LocationWizardDialogComponent } from 'src/app/pages/admin/manage-locations/location-wizard/locationWizardDialog.component';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IAsset } from 'src/app/models/asset.model';
import { IField } from 'src/app/models/field.model';
import { PeopleCountingAssetWizardDialogComponent } from 'src/app/shared/people-counting/asset-wizard/assetWizardDialog.component';
import { GraphQLError } from 'graphql/error';
import { DialogComponent } from 'projects/ngx-proximus/src/lib/dialog/dialog.component';
import { IPopupConfirmation } from 'projects/ngx-proximus/src/lib/popup-confirmation/popup-confirmation.component';

@Component({
  selector: 'pvf-trail-wizard',
  templateUrl: './trail-wizard.component.html',
  styleUrls: ['./trail-wizard.component.scss']
})
export class TrailWizardComponent implements OnInit, OnDestroy {

  @ViewChild('stepper', {static: false}) stepper: MatStepper;

  public isNullOrUndefined = isNullOrUndefined;
  public descriptionFormGroup: FormGroup;
  public location: IPeopleCountingLocation;
  public editMode = false;
  public displayLocationExplorer = false;
  public fields: IField[];
  public assets = [];
  public isSavingOrUpdating: boolean;

  public changeFloorPlanConfirmationMessage: IPopupConfirmation = {
    title: 'Warning',
    content: 'Pay attention if you replace the floor plan, the sub-locations and assets would need to be re-positioned on the new floorplan image, do you want to proceed?',
    continueButton: 'Yes',
    cancelButton: 'No'
  };

  private originalLocation: IPeopleCountingLocation;
  private assetsRequest$ = new Subject();
  private subs = new SubSink();


  constructor(
    public formBuilder: FormBuilder,
    public changeDetectorRef: ChangeDetectorRef,
    public activatedRoute: ActivatedRoute,
    public locationService: LocationService,
    public walkingTrailLocationService: WalkingTrailLocationService,
    public assetService: WalkingTrailAssetService,
    public dialog: MatDialog,
    public router: Router,
    public translateService: TranslateService
  ) {}

  async ngOnInit() {
    const locationId = this.activatedRoute.snapshot.params.id;
    const parentId =  this.getParentId();

    this.descriptionFormGroup = this.formBuilder.group({
      NameCtrl: ['', Validators.required],
      DescriptionCtrl: ['', null],
    });

    this.fields = await this.locationService.getCustomFields().toPromise();

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
        this.location = await this.walkingTrailLocationService.getLocationById(locationId).toPromise();
        this.assetsRequest$.next();
        this.editMode = true;
        this.originalLocation = cloneDeep(this.location);
        this.subs.add(
          this.walkingTrailLocationService.getImageCollectionById(locationId).subscribe(location => {
            this.location.images = location.images.slice(0);
            this.originalLocation.images = location.images.slice(0);
          })
        );
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
      module: 'PEOPLE_COUNTING_WALKING_TRAIL'
    };
    if (!isNullOrUndefined(parentId)) {
      this.location.parent = await this.locationService.getLocationById(parentId).toPromise();
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
    this.cleanImageCollection();
    if (this.editMode || !isNullOrUndefined(this.location.id)) {
      const includeProperties = ['name', 'description', 'geolocation', 'parentId', 'image', 'images', 'customFields'];
      const differences = compareTwoObjectOnSpecificProperties(this.location, this.originalLocation, includeProperties);

      const location: IPeopleCountingLocation = {
        id: this.location.id,
      };

      for (const difference of differences) {
        location[difference] = this.location[difference];
      }

      this.subs.add(
        this.walkingTrailLocationService.updateLocation(location).subscribe(
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
        this.walkingTrailLocationService.createLocation(this.location).subscribe(
          (location: IPeopleCountingLocation | null) => {
            this.location.id = location.id;
            this.originalLocation = cloneDeep(location);
            this.changeDetectorRef.detectChanges();
            this.stepper.next();
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

  private cleanImageCollection() {
    this.location.images = compact(this.location.images);
  }

  public done() {
    if (this.editMode) {
      this.isSavingOrUpdating = true;
      this.cleanImageCollection();
      const includeProperties = ['name', 'description', 'geolocation', 'parentId', 'image', 'images', 'customFields'];
      const differences = compareTwoObjectOnSpecificProperties(this.location, this.originalLocation, includeProperties);

      const location: IPeopleCountingLocation = {
        id: this.location.id,
      };

      for (const difference of differences) {
        location[difference] = this.location[difference];
      }

      this.subs.add(
        this.walkingTrailLocationService.updateLocation(location).subscribe(
          (updatedLocation: ILocation | null) => {
            if (updatedLocation) {
              this.goToTrailPage(this.location.id);
            }
            this.isSavingOrUpdating = false;
          },
          (error) => {
            console.error(error);
            this.isSavingOrUpdating = false;
            this.checkIfNameAlreadyExistAndDisplayDialog(error);
          }
        )
      );
    } else {
      this.goToTrailPage(this.location.id);
    }
  }


  private goToTrailPage(locationId: string) {
    this.router.navigateByUrl(`/private/walkingtrail/trail/${locationId}`);
  }


  public addImage() {
    const length = this.location.images.length;
    if (length) {
      if (!this.location.images[length - 1]) {
        return;
      }
    }
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
      this.location.parentId = result.id;
      this.displayLocationExplorer = true;
    }
  }

  private checkIfNameAlreadyExistAndDisplayDialog(error) {
    const graphQLErrors: GraphQLError = error.graphQLErrors;
    const errorExtensions = graphQLErrors[0].extensions;
    if (errorExtensions) {
      const nameAlreadyUsed = errorExtensions.locationNameNotUnique;
      if (nameAlreadyUsed) {
        console.error('Trail\'s name is already used');
        this.dialog.open(DialogComponent, {
          data: {
            title: `${nameAlreadyUsed} ${this.translateService.instant('DIALOGS.FAILS.ALREADY_EXISTS')}`,
            message: this.translateService.instant('DIALOGS.FAILS.CHOOSE_AN_OTHER_LOCATION_NAME')
          },
          minWidth: '320px',
          maxWidth: '400px',
          width: '100vw',
          maxHeight: '80vh',
        });
      }
    }
  }

  public changeLocationImages(index: number, image: string) {
    if (typeof image === 'string') {
      this.location.images[index] = image;
    }
  }

  public cancelWizard() {
    this.router.navigateByUrl('/private/walkingtrail/dashboard');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
