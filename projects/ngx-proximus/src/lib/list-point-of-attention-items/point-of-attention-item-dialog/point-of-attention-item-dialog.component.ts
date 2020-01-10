import { PointOfAttentionService } from 'src/app/services/point-of-attention.service';
import { cloneDeep } from 'lodash';
import { IAsset } from 'src/app/models/g-asset.model';
import { IPointOfAttentionItem, PointOfAttentionItem, EAggregation } from './../../../../../../src/app/models/point-of-attention.model';
import { ISensorType } from 'src/app/models/g-sensor-type.model';
import { NewSensorService } from 'src/app/services/new-sensor.service';
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddAssetDialogComponent } from './add-asset-dialog/add-asset-dialog.component';
import { ILocation } from 'src/app/models/g-location.model';
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
    public dialogRef: MatDialogRef<PointOfAttentionItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    private sensorService: NewSensorService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private pointOfAttentionService: PointOfAttentionService,
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

  public openAssetPicker(item: IPointOfAttentionItem = null) {
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
        this.pointOfAttentionItem.assets.push(asset);
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
    if (this.data.item && this.data.item.id) {
      const pointOfAttentionItem: IPointOfAttentionItem = {
        id: this.pointOfAttentionItem.id,
      };
      const includeProperties = ['name', 'sensorType', 'aggregationType'];
      const differences = compareTwoObjectOnSpecificProperties(this.pointOfAttentionItem, this.originalPointOfAttentionItem, includeProperties);
      for (const difference of differences) {
        pointOfAttentionItem[difference] = this.pointOfAttentionItem[difference];
      }
      pointOfAttentionItem.assets = this.pointOfAttentionItem.assets;
      this.pointOfAttentionService.updatePointOfAttentionItem(pointOfAttentionItem).subscribe(
        result => {
          if (result) {
            this.dialogRef.close(this.pointOfAttentionItem);
          } else {
            console.log('impossible to save the point of attention item');
          }
        },
        error => {
          console.error(error);
        }
      );
    } else if (this.data.pointOfAttentionId) {
      this.pointOfAttentionService.createPointOfAttentionItem(
        this.pointOfAttentionItem,
        this.data.pointOfAttentionId
      ).subscribe(
        result => {
          if (result) {
            this.dialogRef.close(this.pointOfAttentionItem);
          } else {
            console.log('impossible to save the point of attention item');
          }
        },
        error => {
          console.error(error);
        }
      );
    } else {
      this.dialogRef.close(this.pointOfAttentionItem);
    }
  }

}
