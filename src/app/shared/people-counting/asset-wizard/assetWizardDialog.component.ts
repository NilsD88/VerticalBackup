import { ThingService } from './../../../services/thing.service';
import { TranslateService } from '@ngx-translate/core';
import { AssetService } from 'src/app/services/asset.service';
import {Component, OnInit, Optional, Inject, OnDestroy} from '@angular/core';
import {FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router} from '@angular/router';
import { isNullOrUndefined } from 'util';
import { IAsset } from 'src/app/models/asset.model';
import { compareTwoObjectOnSpecificProperties } from 'src/app/shared/utils';
import { cloneDeep } from 'lodash';
import { PeopleCountingAssetWizardComponent } from './asset-wizard.component';
import { SensorService } from 'src/app/services/sensor.service';

@Component({
  selector: 'pvf-walkingtrails-asset-wizard',
  templateUrl: './asset-wizard.component.html',
  styleUrls: ['./asset-wizard.component.scss'],
})
export class PeopleCountingAssetWizardDialogComponent extends PeopleCountingAssetWizardComponent implements OnInit, OnDestroy {

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() public dialogRef: MatDialogRef < PeopleCountingAssetWizardComponent >,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public assetService: AssetService,
    public sensorService: SensorService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public translateService: TranslateService,
    public thingService: ThingService,
  ) {
      super(
        formBuilder,
        dialog,
        assetService,
        sensorService,
        activatedRoute,
        router,
        translateService,
        thingService,
      );
      this.showCancel = false;
  }

  async ngOnInit() {
    super.init();
    const assetId = this.activatedRoute.snapshot.params.id;
    if (!isNullOrUndefined(assetId) && assetId !== 'new') {
      try {
        this.asset = await this.assetService.getAssetById(assetId).toPromise();
        this.editMode = true;
        this.originalAsset = cloneDeep(this.asset);
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
      location: this.data.location,
      locationId: this.data.location.id,
      things: [],
      thresholdTemplate: null,
      customFields: [],
      module: this.data.module
    };
  }



  public submit() {
    this.isSavingOrUpdating = true;
    if (this.editMode) {

      const includeProperties = ['name', 'description', 'geolocation', 'locationId', 'image', 'things', 'thresholdTemplate'];
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
        this.assetService.updateAsset(asset).subscribe(
          () => {
            this.isSavingOrUpdating = false;
            this.dialogRef.close(this.asset);
          },
          (error) => {
            this.isSavingOrUpdating = false;
            console.error(error);
          }
        )
      );
    } else {
      this.subs.add(
        this.assetService.createAsset(this.asset).subscribe(
          () => {
            this.isSavingOrUpdating = false;
            this.dialogRef.close(this.asset);
          },
          (error) => {
            this.isSavingOrUpdating = false;
            console.error(error);
          }
        )
      );
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
