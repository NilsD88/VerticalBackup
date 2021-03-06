import { SensorService } from 'src/app/services/sensor.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AddThresholdComponent } from 'src/app/pages/admin/manage-threshold-templates/add-threshold/add-threshold.component';
import { Component } from '@angular/core';

@Component({
    selector: 'pvf-add-threshold-dialog',
    templateUrl: '../../../admin/manage-threshold-templates/add-threshold/add-threshold.component.html',
})
export class AddThresholdDialogComponent extends AddThresholdComponent {
    constructor(
        public dialogRef: MatDialogRef<AddThresholdDialogComponent>,
        public sensorService: SensorService
    ) {
        super(
            dialogRef,
            sensorService,
        );
    }
}
