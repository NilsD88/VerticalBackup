import { PointOfAttentionService } from 'src/app/services/point-of-attention.service';
import { cloneDeep } from 'lodash';
import { IAsset } from 'src/app/models/asset.model';
import { IPointOfAttentionItem, PointOfAttentionItem, EAggregation } from './../../../../../../src/app/models/point-of-attention.model';
import { ISensorType } from 'src/app/models/sensor-type.model';
import { SensorService } from 'src/app/services/sensor.service';
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddAssetDialogComponent } from './add-asset-dialog/add-asset-dialog.component';
import { ILocation } from 'src/app/models/location.model';
import { compareTwoObjectOnSpecificProperties } from 'src/app/shared/utils';


interface IDialogData {
  pointOfAttentionId: string;
  item: IPointOfAttentionItem;
  location: ILocation;
}

@Component({
  selector: 'pxs-point-of-attention-item-dialog',
  templateUrl: './point-of-attention-item-dialog.component.html',
  styleUrls: ['./point-of-attention-item-dialog.component.scss']
})
export class PointOfAttentionItemDialogComponent implements OnInit {

  public sensorTypes: ISensorType[];
  public pointOfAttentionItem: IPointOfAttentionItem;
  public originalPointOfAttentionItem: IPointOfAttentionItem;
  public aggregations = Object.keys(EAggregation);
  public fieldFormGroup: FormGroup;

  public assetIsLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    public dialogRef: MatDialogRef<PointOfAttentionItemDialogComponent>,
    private sensorService: SensorService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    dialogRef.disableClose = true;
  }

  async ngOnInit() {
    this.fieldFormGroup = this.formBuilder.group({
        SensorTypeCtrl: ['', Validators.required],
        NameCtrl: ['', Validators.required],
        AggregationCtrl: ['', Validators.required],
    });
    this.pointOfAttentionItem = new PointOfAttentionItem(this.data.item);
    this.originalPointOfAttentionItem = cloneDeep(this.pointOfAttentionItem);
    this.sensorTypes = await this.sensorService.getSensorTypeNames().toPromise();
    this.changeDetectorRef.detectChanges();
  }

  public openAssetPicker() {
    this.dialog.open(AddAssetDialogComponent, {
      minWidth: '320px',
      maxWidth: '400px',
      width: '100vw',
      maxHeight: '80vh',
      data: {
        selectedLocation: this.data.location
      }
    }).afterClosed().subscribe((asset: IAsset) => {
      if (asset) {
        if (this.pointOfAttentionItem.assets.findIndex(x => x.id === asset.id) < 0) {
          this.pointOfAttentionItem.assets.push(asset);
        }
      }
    });
  }

  public compareById(option, value): boolean {
    return option.id === value.id;
  }

  public deleteAsset(assetId: string) {
    const assetIndex = this.pointOfAttentionItem.assets.findIndex(a => a.id === assetId);
    this.pointOfAttentionItem.assets.splice(assetIndex, 1);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.pointOfAttentionItem);
  }

}
