import { SensorService } from '../../../../services/sensor.service';
import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import { ISensorType } from 'src/app/models/sensor-type.model';

@Component({
  selector: 'pvf-add-threshold',
  templateUrl: './add-threshold.component.html',
})
export class AddThresholdComponent implements OnInit {
  items: ISensorType[] = [];
  item: ISensorType = null;

  constructor(public dialogRef: MatDialogRef<AddThresholdComponent>, public sensorService: SensorService) {
  }

  async ngOnInit() {
    await this.loadItems();
  }

  async loadItems() {
    this.items = await this.sensorService.getSensorTypes().toPromise();
  }

  submit() {
    this.dialogRef.close(this.item);
  }

  cancel() {
    this.dialogRef.close(null);
  }

}
