import { chartTypes, aggregatedValues } from './../../../../../../src/app/models/g-sensor-definition.model';
import {Component, OnInit, Optional, Inject} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import { ISensorDefinition } from '../../../../../../src/app/models/g-sensor-definition.model';
import {MAT_DIALOG_DATA} from '@angular/material';
import { ISensor } from 'src/app/models/g-sensor.model';

@Component({
    selector: 'pxs-edit-sensor-popup',
    templateUrl: './edit-sensor-popup.component.html',
    styleUrls: ['./edit-sensor-popup.component.scss']
})
export class EditSensorPopupComponent implements OnInit {

    public chartTypes = chartTypes;
    public aggregatedValues = aggregatedValues;
    public sensorDefinition: ISensorDefinition;

    constructor(
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<EditSensorPopupComponent>
    ) {}

    async ngOnInit() {
        // get the current sensor definition of the sensor

        // Default values
        this.sensorDefinition = {
            useOnChart: true,
            chartType: 'linear',
            useOnThresholdTemplate: true,
            aggregatedValues: {
                min: true,
                max: true,
                avg: false,
                sum: false,
            }
        };
    }

    submit() {
        this.dialogRef.close('message');
    }

    cancel() {
        this.dialogRef.close(null);
    }
}
