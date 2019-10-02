import { LocationWizardComponent } from './../../../manage-locations/location-wizard/location-wizard.component';
import { NewLocationService } from './../../../../../services/new-location.service';
import { NewAssetService } from './../../../../../services/new-asset.service';
import {Component, OnInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ILocation } from 'src/app/models/g-location.model';
import { IThing } from 'src/app/models/g-thing.model';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material';
import { PopupConfirmationComponent } from 'projects/ngx-proximus/src/lib/popup-confirmation/popup-confirmation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { IAsset } from 'src/app/models/g-asset.model';
import { ManageThresholdTemplatesComponent } from '../../../manage-threshold-templates/smartmonitoring/manage-threshold-templates.component';
import { NewThresholdTemplate } from 'src/app/models/new-threshold-template.model';
import { compareTwoObjectOnSpecificProperties } from 'src/app/shared/utils';

import { cloneDeep } from 'lodash';


@Component({
  selector: 'pvf-asset-wizard',
  templateUrl: './asset-wizard.component.html',
  styleUrls: ['./asset-wizard.component.scss'],
})
export class AssetWizardComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;

  private originalAsset: IAsset;

  public asset: IAsset;
  public editMode = false;

  public displayLocationExplorer = true;
  public displayThresholdTemplateList = true;

  public descriptionFormGroup: FormGroup;

  public keyValues: {
    label: string;
    type: string;
  }[] = [
    {
      label: 'Country',
      type: 'string'
    },
    {
      label: 'Address',
      type: 'string'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private newAssetService: NewAssetService,
    private newLocationService: NewLocationService,
    private router: Router,
    public activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.descriptionFormGroup = this.formBuilder.group({
      NameCtrl: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      DescriptionCtrl: ['', null],
      TypeCtrl: ['', null],
    });

    for (const kv of this.keyValues) {
      this.descriptionFormGroup.addControl(kv.label, new FormControl());
    }

    this.checkIfEdtitingOrCreating();
  }

  public async checkIfEdtitingOrCreating() {
    const assetId = await this.getRouteId();
    if (assetId) {
      console.log('[ASSET] UPDATE ASSET_ID', assetId);
      this.asset = await this.newAssetService.getAssetById(+assetId).toPromise();
      this.editMode = true;
      this.originalAsset = cloneDeep(this.asset);
      if (!isNullOrUndefined(this.asset.locationId)) {
        this.asset.location = await this.newLocationService.getLocationById(this.asset.locationId).toPromise();
      }
      if (isNullOrUndefined(this.asset.things)) {
        this.asset.things = [];
      }
    } else {
      console.log('[ASSET] NEW', assetId);
      this.asset = {
        id: null,
        name: null,
        locationId: null,
        things: [],
        thresholdTemplate: null
      };
    }
  }

  public updateLocation(location: ILocation) {
    const oldSelectedLocation = this.asset.location;
    if (location && location !== oldSelectedLocation) {
      this.asset.geolocation = null;
      this.asset.location = null;
      this.changeDetectorRef.detectChanges();
      this.asset.location = location;
      this.asset.locationId = location.id;
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

  public thresholdTemplateIsCompatibleWithThings() {
    const thresholdTemplate = this.asset.thresholdTemplate;
    if (thresholdTemplate) {
      for (const threshold of thresholdTemplate.thresholds) {
        const sensorTypeId = threshold.sensorType.id;
        let hasAtLeastOneCompatibleSensor = false;
        const things = this.asset.things;
        for (const thing of things) {
          hasAtLeastOneCompatibleSensor = thing.sensors.some((thingSensor) => +thingSensor.sensorType.id === +sensorTypeId);
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
          width: '250px',
          data: {
            title: 'Warning',
            content: 'Not all the sensors defined in the threshold template are matching the sensor assigned to this asset'
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

  public wantToSaveAsset() {
    console.log('[ASSET] WANT TO SAVE');
    const compatibleThresholdTemplate = this.thresholdTemplateIsCompatibleWithThings();
    if (!compatibleThresholdTemplate) {
      const dialogRef = this.dialog.open(PopupConfirmationComponent, {
        width: '250px',
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

  private getRouteId(): Promise<string | number> {
    return new Promise((resolve, reject) => {
      this.activatedRoute.params.subscribe((params) => {
        if (!isNullOrUndefined(params.id)) {
          resolve(params.id);
        } else {
          resolve();
        }
      }, reject);
    });
  }

  private submit() {
    if (this.editMode) {

      const includeProperties = ['name', 'description', 'geolocation', 'locationId', 'image', 'things', 'thresholdTemplate'];
      const differences = compareTwoObjectOnSpecificProperties(this.asset, this.originalAsset, includeProperties);

      const asset: IAsset = {
        id: this.asset.id,
      };

      for (const difference of differences) {
        switch (difference) {
          case 'thresholdTemplate':
            asset.thresholdTemplateId = this.asset.thresholdTemplate.id;
            break;
          case 'things':
            asset.thingsId = this.asset.things.map(thing => thing.id);
            break;
          default:
            asset[difference] = this.asset[difference];
        }
      }

      this.newAssetService.a_updateAsset(asset).subscribe((result) => {
        this.goToManageAssets();
      });
    } else {
      this.newAssetService.createAsset(this.asset).subscribe((result) => {
        this.goToManageAssets();
      });
    }
  }

  private goToManageAssets() {
    this.router.navigateByUrl('/private/admin/manage-assets');
  }


  // POPUPS

  public async openAddLocation() {
    const dialogRef = this.dialog.open(LocationWizardComponent, {
      minWidth: '320px',
      maxWidth: '1024px',
      width: '100vw',
      data: {
        parentLocation: this.asset.location,
        fromPopup: true,
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
    const dialogRef = this.dialog.open(ManageThresholdTemplatesComponent, {
      minWidth: '320px',
      maxWidth: '1024px',
      width: '100vw',
      data: {
        parentLocation: this.asset.location,
        fromPopup: true,
      }
    });
    const result: NewThresholdTemplate = (await dialogRef.afterClosed().toPromise()) as NewThresholdTemplate;
    if (result) {
      this.displayThresholdTemplateList = false;
      this.changeDetectorRef.detectChanges();
      this.asset.thresholdTemplate = result;
      this.displayThresholdTemplateList = true;
    }
  }

}
