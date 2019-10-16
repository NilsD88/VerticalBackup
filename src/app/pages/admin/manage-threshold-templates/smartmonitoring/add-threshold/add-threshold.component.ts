import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {SensorType} from '../../../../../models/sensor.model';
import {FilterService} from '../../../../../services/filter.service';

@Component({
  selector: 'pvf-add-threshold',
  templateUrl: './add-threshold.component.html',
})
export class AddThresholdComponent implements OnInit {
  items: SensorType[] = [];
  item: SensorType = null;

  constructor(public dialogRef: MatDialogRef<AddThresholdComponent>, public filterService: FilterService) {
  }

  async ngOnInit() {
    await this.loadItems();
  }

  async loadItems() {
    this.items = await this.filterService.getSensorTypes();
  }

  submit() {
    this.dialogRef.close(this.item);
  }

  cancel() {
    this.dialogRef.close(null);
  }

}
