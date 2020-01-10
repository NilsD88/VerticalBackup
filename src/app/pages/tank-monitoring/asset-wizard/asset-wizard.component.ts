import { SubSink } from 'subsink';
import { NewSensorService } from 'src/app/services/new-sensor.service';
import { ISensorType } from './../../../models/g-sensor-type.model';
import { TankMonitoringAssetService } from './../../../services/tankmonitoring/asset.service';
import { LocationWizardDialogComponent } from 'src/app/pages/admin/manage-locations/location-wizard/locationWizardDialog.component';
import {Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ILocation } from 'src/app/models/g-location.model';
import { IThing } from 'src/app/models/g-thing.model';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material';
import { PopupConfirmationComponent } from 'projects/ngx-proximus/src/lib/popup-confirmation/popup-confirmation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { IAsset } from 'src/app/models/g-asset.model';
import { compareTwoObjectOnSpecificProperties } from 'src/app/shared/utils';
import { cloneDeep } from 'lodash';
import { IThresholdTemplate } from 'src/app/models/g-threshold-template.model';
import { ManageThresholdTemplatesDialogComponent } from '../../admin/manage-threshold-templates/manageThresholdTemplatesDialog.component';
import { IField } from 'src/app/models/field.model';


@Component({
  selector: 'pvf-tankmonitoring-asset-wizard',
  templateUrl: './asset-wizard.component.html',
  styleUrls: ['./asset-wizard.component.scss'],
})
export class TankMonitoringAssetWizardComponent implements OnInit, OnDestroy {

  @ViewChild('stepper', {static: false}) stepper: MatStepper;

  public asset: IAsset;
  public editMode = false;
  public displayLocationExplorer = true;
  public displayThresholdTemplateList = true;
  public descriptionFormGroup: FormGroup;
  public fields: IField[];
  public compatibleSensorTypes: ISensorType[];
  public isSavingOrUpdating: boolean;

  private originalAsset: IAsset;
  private subs = new SubSink();

  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private tankMonitoringAssetService: TankMonitoringAssetService,
    private sensorService: NewSensorService,
    private router: Router,
    public activatedRoute: ActivatedRoute
  ) {
  }

  async ngOnInit() {

    this.descriptionFormGroup = this.formBuilder.group({
      NameCtrl: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      DescriptionCtrl: ['', null],
    });

    this.fields = await this.tankMonitoringAssetService.getCustomFields().toPromise();
    this.compatibleSensorTypes = await this.sensorService.getSensorTypesByModule('TANK_MONITORING').toPromise();

    const assetId = this.activatedRoute.snapshot.params.id;
    if (!isNullOrUndefined(assetId) && assetId !== 'new') {
      try {
        this.asset = await this.tankMonitoringAssetService.getAssetById(assetId).toPromise();
        this.editMode = true;
        this.originalAsset = cloneDeep(this.asset);
        this.originalAsset.locationId = this.originalAsset.location.id;
      } catch (err) {
        this.asset = this.emptyAsset();
      }
    } else {
      this.asset = this.emptyAsset();
    }
  }

  private emptyAsset(): IAsset {
    return {
      id: null,
      name: null,
      locationId: null,
      things: [],
      thresholdTemplate: null,
      customFields: [],
    };
  }

  public updateLocation(location: ILocation) {
    const oldSelectedLocation = this.asset.location;
    if (location && location !== oldSelectedLocation) {
      this.asset.geolocation = null;
      this.asset.location = null;
      this.changeDetectorRef.detectChanges();
      if (location.id) {
        this.asset.location = location;
        this.asset.locationId = location.id;
      }
    }
  }

  public selectedThingsChange(thing: IThing) {
    const thingIndex = this.asset.things.findIndex((t) => thing.id === t.id);
    if (thingIndex > -1) {
      this.asset.things.splice(thingIndex, 1);
    } else {
      this.asset.things.push(thing);
    }
  }

  public checkThings() {
    if (this.oneThingCompatibleWithModule()) {
      this.stepper.next();
    } else {
      this.dialog.open(PopupConfirmationComponent, {
        minWidth: '320px',
        maxWidth: '400px',
        width: '100vw',
        maxHeight: '80vh',
        data: {
          title: 'Warning',
          content: 'You can an only add an asset with at least one thing defined for tank monitoring',
          hideContinue: true,
        }
      });
    }
  }

  public oneThingCompatibleWithModule(): boolean {
    for (const thing of this.asset.things) {
      for (const sensor of thing.sensors) {
        if (this.compatibleSensorTypes.findIndex( x => x.id === sensor.sensorType.id) > -1) {
          return true;
        }
      }
    }
    return false;
  }

  public thresholdTemplateIsCompatibleWithThings(): boolean {
    const thresholdTemplate = this.asset.thresholdTemplate;
    if (thresholdTemplate && thresholdTemplate.thresholds) {
      for (const threshold of thresholdTemplate.thresholds) {
        const sensorTypeId = threshold.sensorType.id;
        let hasAtLeastOneCompatibleSensor = false;
        const things = this.asset.things;
        for (const thing of things) {
          hasAtLeastOneCompatibleSensor = (thing.sensors || []).some((thingSensor) => thingSensor.sensorType.id === sensorTypeId);
          if (hasAtLeastOneCompatibleSensor) {
            break;
          }
        }
        if (!hasAtLeastOneCompatibleSensor) {
          return false;
        }
      }
      return true;
    } else {
      return true;
    }
  }

  public wantToSaveAsset() {
    const compatibleThresholdTemplate = this.thresholdTemplateIsCompatibleWithThings();
    if (!compatibleThresholdTemplate) {
      const dialogRef = this.dialog.open(PopupConfirmationComponent, {
        minWidth: '320px',
        maxWidth: '400px',
        width: '100vw',
        maxHeight: '80vh',
        data: {
          title: 'Warning',
          content: 'Not all the sensors defined in the threshold template are matching the sensor assigned to this asset'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.submit();
        }
      });
    } else {
      this.submit();
    }
  }

  private submit() {
    this.isSavingOrUpdating = true;
    if (this.editMode) {
      const includeProperties = ['name', 'description', 'geolocation', 'locationId', 'image', 'things', 'thresholdTemplate', 'customFields'];
      const differences = compareTwoObjectOnSpecificProperties(this.asset, this.originalAsset, includeProperties);
      const asset: IAsset = {
        id: this.asset.id,
      };

      for (const difference of differences) {
        switch (difference) {
          case 'thresholdTemplate':
            asset.thresholdTemplateId = (this.asset.thresholdTemplate || {}).id || null;
            break;
          case 'things':
            asset.thingIds = this.asset.things.map(thing => thing.id);
            break;
          default:
            asset[difference] = this.asset[difference];
        }
      }

      this.subs.add(
        this.tankMonitoringAssetService.updateAsset(asset).subscribe(
          () => {
            this.isSavingOrUpdating = false;
            this.goToInventory();
          },
          (error) => {
            this.isSavingOrUpdating = false;
            console.error(error);
          }
        )
      );
    } else {
      this.subs.add(
        this.tankMonitoringAssetService.createAsset(this.asset).subscribe(
          () => {
            this.isSavingOrUpdating = false;
            this.goToInventory();
          },
          (error) => {
            this.isSavingOrUpdating = false;
            console.error(error);
          }
        )
      );
    }
  }

  private goToInventory() {
    this.router.navigateByUrl('/private/tankmonitoring/inventory');
  }


  // POPUPS


  public async openAddLocation() {
    const dialogRef = this.dialog.open(LocationWizardDialogComponent, {
      minWidth: '320px',
      maxWidth: '1024px',
      width: '100vw',
      maxHeight: '80vh',
      data: {
        parentLocation: this.asset.location,
      }
    });
    const result: ILocation = await dialogRef.afterClosed().toPromise();
    if (result) {
      this.displayLocationExplorer = false;
      this.changeDetectorRef.detectChanges();
      this.asset.location = result;
      this.displayLocationExplorer = true;
    }
  }

  public async openAddThresholdTemplate() {
    const dialogRef = this.dialog.open(ManageThresholdTemplatesDialogComponent, {
      minWidth: '320px',
      maxWidth: '600px',
      width: '100vw',
      maxHeight: '80vh',
      data: {
        parentLocation: this.asset.location,
        fromPopup: true,
      }
    });
    const result: IThresholdTemplate = (await dialogRef.afterClosed().toPromise()) as IThresholdTemplate;
    if (result) {
      this.displayThresholdTemplateList = false;
      this.changeDetectorRef.detectChanges();
      this.asset.thresholdTemplate = result;
      this.displayThresholdTemplateList = true;
    }
  }


  public cancelWizard() {
    this.router.navigateByUrl('/private/tankmonitoring/dashboard');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
