import { NewSensorService } from './../../../../../../src/app/services/new-sensor.service';
import { chartTypes, aggregatedValues } from 'src/app/models/g-sensor-definition.model';
import {Component, OnInit, Optional, Inject} from '@angular/core';
import {MatDialogRef, MatCheckboxChange, MatSnackBar} from '@angular/material';
import { ISensorDefinition } from 'src/app/models/g-sensor-definition.model';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'pxs-edit-sensor-popup',
    templateUrl: './edit-sensor-popup.component.html',
    styleUrls: ['./edit-sensor-popup.component.scss']
})
export class EditSensorPopupComponent implements OnInit {

    public chartTypes = chartTypes;
    public aggregatedValues = aggregatedValues;
    public sensorDefinition: ISensorDefinition;
    public loading = false;

    constructor(
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<EditSensorPopupComponent>,
        private newSensorService: NewSensorService,
        public snackBar: MatSnackBar,
    ) {}

    async ngOnInit() {
        if (this.data.sensor.sensorDefinition) {
            this.sensorDefinition = this.data.sensor.sensorDefinition;
            console.log(this.sensorDefinition);
        } else {
            this.sensorDefinition = {
                name: null,
                useOnChart: true,
                chartType: 'spline',
                useOnNotification: true,
                aggregatedValues: {
                    min: true,
                    max: true,
                    avg: true,
                    sum: false,
                }
            };
        }
    }

    useOnChartChange(event: MatCheckboxChange) {
        if (event.checked) {
            this.sensorDefinition.chartType = 'spline';
            this.sensorDefinition.aggregatedValues = {
                min: true,
                max: true,
                avg: true,
                sum: false
            };
        } else {
            this.sensorDefinition.chartType = 'spline';
            this.sensorDefinition.aggregatedValues = {
                min: false,
                max: false,
                avg: false,
                sum: false
            };
        }
    }

    submit() {
        this.loading = true;
        delete (this.sensorDefinition).id;
        this.newSensorService.updateSensorDefinition(this.data.sensor.id, this.sensorDefinition).subscribe(
            (result) => {
                this.loading = false;
                if (result) {
                    this.dialogRef.close('sensor definition updated!');
                }
            },
            (error) => {
                this.loading = false;
                console.log(error);
                this.snackBar.open(`Failed to update the sensor definition!`, null, {
                    panelClass: ['error-snackbar'],
                    duration: 3000
                });
            }
        );
    }

    cancel() {
        this.dialogRef.close(null);
    }
}
