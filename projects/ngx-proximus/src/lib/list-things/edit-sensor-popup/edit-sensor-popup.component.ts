import { NewSensorService } from './../../../../../../src/app/services/new-sensor.service';
import { chartTypes, aggregatedValues, InOutValues } from 'src/app/models/g-sensor-definition.model';
import { Component, OnInit, Optional, Inject, OnDestroy } from '@angular/core';
import {MatDialogRef, MatCheckboxChange, MatSnackBar} from '@angular/material';
import { ISensorDefinition } from 'src/app/models/g-sensor-definition.model';
import {MAT_DIALOG_DATA} from '@angular/material';
import { SubSink } from 'subsink';
import { LayoutService } from 'src/app/layout/layout.service';

@Component({
    selector: 'pxs-edit-sensor-popup',
    templateUrl: './edit-sensor-popup.component.html',
    styleUrls: ['./edit-sensor-popup.component.scss']
})
export class EditSensorPopupComponent implements OnInit, OnDestroy {

    public chartTypes = chartTypes;
    public aggregatedValues = aggregatedValues;
    public sensorDefinition: ISensorDefinition;
    public loading = false;
    public inOutValues = InOutValues;
    public hasPeopleCounting = false;

    private subs = new SubSink();

    constructor(
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<EditSensorPopupComponent>,
        private newSensorService: NewSensorService,
        public snackBar: MatSnackBar,
        private layoutService: LayoutService
    ) {}

    async ngOnInit() {
        this.hasPeopleCounting = (this.layoutService.user.modules.findIndex(x => x.startsWith('PEOPLE_COUNTING')) >= 0);
        if (this.data.sensor.sensorDefinition) {
            this.sensorDefinition = this.data.sensor.sensorDefinition;
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
            if (this.data.sensor.sensorType.type === 'COUNTER') {
                this.sensorDefinition.inOutType = 'BOTH';
            }
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
        this.subs.sink = this.newSensorService.updateSensorDefinition(this.data.sensor.id, this.sensorDefinition).subscribe(
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

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
