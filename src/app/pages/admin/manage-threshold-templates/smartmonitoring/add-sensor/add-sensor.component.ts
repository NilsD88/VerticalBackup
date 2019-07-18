import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {SensorType} from '../../../../../models/sensor.model';
import {FilterService} from '../../../../../services/filter.service';

@Component({
  selector: 'pvf-add-sensor',
  templateUrl: './add-sensor.component.html',
  styleUrls: ['./add-sensor.component.scss']
})
export class AddSensorComponent implements OnInit {
  items: SensorType[] = [];
  item: SensorType = null;

  constructor(public dialogRef: MatDialogRef<AddSensorComponent>, public filterService: FilterService) {
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
