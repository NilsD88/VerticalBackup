import { NewLocationService } from './../../../../../services/new-location.service';
import { NewAssetService } from './../../../../../services/new-asset.service';
import {Component, OnInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { INewLocation } from 'src/app/models/new-location';
import { IThing } from 'src/app/models/thing.model';
import { ThingService } from 'src/app/services/thing.service';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material';
import { PopupConfirmationComponent } from 'projects/ngx-proximus/src/lib/popup-confirmation/popup-confirmation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { INewAsset } from 'src/app/models/new-asset.model';


@Component({
  selector: 'pvf-asset-wizard',
  templateUrl: './asset-wizard.component.html',
  styleUrls: ['./asset-wizard.component.scss'],
})
export class AssetWizardComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;

  public asset: INewAsset;
  public editMode = false;

  dialogConfirmForIncompatibleThreshold: {title: string, content: string};

  descriptionFormGroup: FormGroup;

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
    private thingService: ThingService,
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

    this.dialogConfirmForIncompatibleThreshold = {
      title: 'Warning!',
      content: 'Not all the sensors defined in the threshold template are matching the sensor assigned to this asset'
    };

    const assetId = await this.getRouteId();
    if (assetId) {
      this.asset = await this.newAssetService.getAssetById(+assetId).toPromise();
      if (!isNullOrUndefined(this.asset.locationId)) {
        this.asset.location = await this.newLocationService.getLocationById(+this.asset.locationId).toPromise();
      }
      console.log({...this.asset});
      console.log(this.asset.geolocation);

      if (isNullOrUndefined(this.asset.things)) {
        this.asset.things = [];
      }

    } else {
      console.log('new asset');
      this.asset = {
        id: null,
        name: null,
        locationId: null,
        things: [],
        thresholdTemplate: null
      };
    }
  }

  updateLocation(location: INewLocation) {
    const oldSelectedLocation = this.asset.location;
    if (location && location !== oldSelectedLocation) {
      this.asset.geolocation = null;
      this.asset.location = null;
      this.changeDetectorRef.detectChanges();
      this.asset.location = location;
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

  thresholdTemplateIsCompatibleWithThings() {
    const thresholdTemplate = this.asset.thresholdTemplate;
    if (thresholdTemplate) {
      for (const sensor of thresholdTemplate.sensors) {
        const sensorTypeId = sensor.sensorType.id;
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

  checkThresholdTemplate(event) {
    if (event.previouslySelectedIndex <= 1 && event.selectedIndex >= 2) {
      const compatibleThresholdTemplate = this.thresholdTemplateIsCompatibleWithThings();
      if(!compatibleThresholdTemplate) {
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
    console.log('wantToSaveAsset');
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

  public submit() {
    if (this.editMode) {
      this.newAssetService.updateAsset(this.asset).subscribe((result) => {
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
}
