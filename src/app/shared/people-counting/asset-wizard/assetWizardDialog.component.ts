import {Component, OnInit, Optional, Inject} from '@angular/core';
import {FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router} from '@angular/router';
import { isNullOrUndefined } from 'util';
import { IAsset } from 'src/app/models/g-asset.model';
import { compareTwoObjectOnSpecificProperties } from 'src/app/shared/utils';
import { cloneDeep } from 'lodash';
import { PeopleCountingAssetWizardComponent } from './asset-wizard.component';
import { WalkingTrailAssetService } from 'src/app/services/walkingtrail/asset.service';

@Component({
  selector: 'pvf-walkingtrail-asset-wizard',
  templateUrl: './asset-wizard.component.html',
  styleUrls: ['./asset-wizard.component.scss'],
})
export class PeopleCountingAssetWizardDialogComponent extends PeopleCountingAssetWizardComponent implements OnInit {

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() public dialogRef: MatDialogRef < PeopleCountingAssetWizardComponent >,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public assetService: WalkingTrailAssetService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
  ) {
      super(
        formBuilder,
        dialog,
        assetService,
        activatedRoute,
        router
      );
  }

  async ngOnInit() {
    this.descriptionFormGroup = this.formBuilder.group({
      NameCtrl: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      DescriptionCtrl: ['', null],
    });

    this.fields = await this.assetService.getCustomFields().toPromise();

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
      customFields: {},
      module: 'WALKING_TRAIL'
    };
  }



  public submit() {
    if (this.editMode) {

      console.log(this.asset);
      console.log(this.originalAsset);

      // TODO: check differences between customFields object
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

      this.assetService.updateAsset(asset).subscribe((result) => {
        this.dialogRef.close(this.asset);
      });
    } else {
      this.assetService.createAsset(this.asset).subscribe((result) => {
        this.dialogRef.close(this.asset);
      });
    }
  }
}
