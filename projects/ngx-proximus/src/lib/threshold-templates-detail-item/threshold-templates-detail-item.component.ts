import { IThresholdWithLastValuesAndIndicators } from './../../../../../src/app/models/g-threshold.model';
import { Component, OnInit, Input } from '@angular/core';
import { IThresholdTemplate } from 'src/app/models/g-threshold-template.model';

@Component({
  selector: 'pxs-threshold-templates-detail-item',
  templateUrl: './threshold-templates-detail-item.component.html',
  styleUrls: ['./threshold-templates-detail-item.component.scss']
})
export class ThresholdTemplatesDetailItemComponent implements OnInit {

  @Input() thresholdTemplate: IThresholdTemplate;
  @Input() lastValues: {
    sensorTypeId: string;
    thingName: string;
    value: number
  }[];

  constructor() { }

  ngOnInit() {

    //TODO: remove these lines
    this.lastValues = [
      {
        sensorTypeId: '1',
        thingName: "Thing 120",
        value: 46
      },
      {
        sensorTypeId: '2',
        thingName: "Thing 220",
        value: 32
      }
    ];

    this.thresholdTemplate.thresholds.forEach((threshold: IThresholdWithLastValuesAndIndicators) => {
      const coef = 100 / (threshold.sensorType.max - threshold.sensorType.min);
      if (this.lastValues) {
        const lastSensorValues = [];
        this.lastValues.forEach(lastValue => {
          if (+lastValue.sensorTypeId === +threshold.sensorType.id) {
            lastSensorValues.push({
              name: lastValue.thingName,
              value: lastValue.value,
              percent: (lastValue.value - threshold.sensorType.min) * coef
            });
          }
        });
        threshold.lastValues = lastSensorValues;
      }
    });
  }

}

