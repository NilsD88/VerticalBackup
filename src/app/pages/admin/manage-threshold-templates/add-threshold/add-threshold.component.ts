import { NewSensorService } from './../../../../services/new-sensor.service';
import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import { ISensorType } from 'src/app/models/g-sensor-type.model';

@Component({
  selector: 'pvf-add-threshold',
  templateUrl: './add-threshold.component.html',
})
export class AddThresholdComponent implements OnInit {
  items: ISensorType[] = [];
  item: ISensorType = null;

  constructor(public dialogRef: MatDialogRef<AddThresholdComponent>, private newSensorService: NewSensorService) {
  }

  async ngOnInit() {
    await this.loadItems();
  }

  async loadItems() {
    this.items = await this.newSensorService.getSensorTypes().toPromise();
  }

  submit() {
    this.dialogRef.close(this.item);
  }

  cancel() {
    this.dialogRef.close(null);
  }

}
