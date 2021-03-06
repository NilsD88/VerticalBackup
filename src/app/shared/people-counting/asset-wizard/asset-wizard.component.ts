import { ThingService } from './../../../services/thing.service';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import { SensorService } from 'src/app/services/sensor.service';
import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IThing } from 'src/app/models/thing.model';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material';
import { PopupConfirmationComponent } from 'projects/ngx-proximus/src/lib/popup-confirmation/popup-confirmation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { IAsset } from 'src/app/models/asset.model';
import { compareTwoObjectOnSpecificProperties } from 'src/app/shared/utils';
import { cloneDeep } from 'lodash';
import { IField } from 'src/app/models/field.model';
import { ISensorType } from 'src/app/models/sensor-type.model';
import { AssetService } from 'src/app/services/asset.service';

@Component({
  selector: 'pvf-walkingtrails-asset-wizard',
  templateUrl: './asset-wizard.component.html',
  styleUrls: ['./asset-wizard.component.scss'],
})
export class PeopleCountingAssetWizardComponent implements OnInit, OnDestroy {

  @ViewChild('stepper', {static: false}) stepper: MatStepper;

  public asset: IAsset;
  public originalAsset: IAsset;
  public editMode = false;
  public compatibleSensorTypes: ISensorType[];
  public displayLocationExplorer = true;
  public displayThresholdTemplateList = true;
  public descriptionFormGroup: FormGroup;
  public fields: IField[];
  public isSavingOrUpdating: boolean;
  public showCancel = true;
  public subs = new SubSink();

  constructor(
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public assetService: AssetService,
    public sensorService: SensorService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public translateService: TranslateService,
    public thingService: ThingService,
  ) {
  }

  async ngOnInit() {
    const assetId = this.activatedRoute.snapshot.params.id;
    if (!isNullOrUndefined(assetId) && assetId !== 'new') {
      try {
        this.asset = await this.assetService.getAssetById(assetId).toPromise();
        if (this.asset.module.indexOf('PEOPLE_COUNTING') < 0) {
          this.router.navigate(['/error/404']);
        }
        this.init();
        this.editMode = true;
        this.originalAsset = cloneDeep(this.asset);
      } catch (err) {
       console.error(err);
       this.router.navigate(['/error/404']);
      }
    } else {
      console.error(`No asset with id ${assetId} was found`);
      this.router.navigate(['/error/404']);
    }
  }

  public async init() {
    this.descriptionFormGroup = this.formBuilder.group({
      NameCtrl: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      DescriptionCtrl: ['', null],
    });

    this.fields = await this.assetService.getCustomFields().toPromise();
    this.compatibleSensorTypes = await this.sensorService.getSensorTypesByModule(this.asset.module).toPromise();
  }


  public async selectedThingsChange(thing: IThing) {
    const thingIndex = this.asset.things.findIndex((t) => thing.id === t.id);
    if (thingIndex > -1) {
      this.asset.things.splice(thingIndex, 1);
    } else {
      const alreadyAssigned = await this.thingService.checkIfThingAssignedToOtherAssets(thing.id, this.asset.id);
      if (alreadyAssigned) {
        this.dialog.open(PopupConfirmationComponent, {
          data: {
            title: `Warning`,
            content: 'This thing is already assigned to another asset, are you sure you want to proceed?'
          },
          minWidth: '320px',
          maxWidth: '400px',
          width: '100vw',
          maxHeight: '80vh',
        }).afterClosed().subscribe(
          result => {
            if (result) {
              this.asset.things.push(thing);
            }
          }
        );
      } else {
        this.asset.things.push(thing);
      }
    }
  }

  public thresholdTemplateIsCompatibleWithThings() {
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

  public checkThresholdTemplate(event) {
    if (event.previouslySelectedIndex <= 1 && event.selectedIndex >= 2) {
      const compatibleThresholdTemplate = this.thresholdTemplateIsCompatibleWithThings();
      if (!compatibleThresholdTemplate) {
        const dialogRef = this.dialog.open(PopupConfirmationComponent, {
          minWidth: '320px',
          maxWidth: '400px',
          width: '100vw',
          maxHeight: '80vh',
          data: {
            title: this.translateService.instant('GENERAL.WARNING'),
            content: this.translateService.instant('DIALOGS.WARNINGS.NOT_ALL_SENSORS_ARE_NOT_MATCHING_WITH_THRESHOLD_TEMPLATE')
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (!result) {
            this.stepper.selectedIndex = 1;
          }
        });
      }
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
          title: this.translateService.instant('GENERAL.WARNING'),
          content: this.translateService.instant('DIALOGS.FAILS.AT_LEAST_ONE_THING_FOR_YOUR_MODULE'),
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

  public wantToSaveAsset() {
    const compatibleThresholdTemplate = this.thresholdTemplateIsCompatibleWithThings();
    if (!compatibleThresholdTemplate) {
      const dialogRef = this.dialog.open(PopupConfirmationComponent, {
        minWidth: '320px',
        maxWidth: '400px',
        width: '100vw',
        maxHeight: '80vh',
        data: {
          title: this.translateService.instant('GENERAL.WARNING'),
          content: this.translateService.instant('DIALOGS.WARNINGS.NOT_ALL_SENSORS_ARE_NOT_MATCHING_WITH_THRESHOLD_TEMPLATE')
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

  public submit() {
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

      this.subs.sink = this.assetService.updateAsset(asset).subscribe(
        () => {
          this.isSavingOrUpdating = false;
          this.router.navigateByUrl('/private/admin/manage-assets');
        },
        (error) => {
          this.isSavingOrUpdating = false;
          console.error(error);
        }
      );
    }
  }

  public cancelWizard() {
    this.router.navigateByUrl('private/admin/manage-assets');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
