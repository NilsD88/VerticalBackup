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

    this.thresholdTemplate.thresholds.forEach(threshold => {
      const coef = 100 / (threshold.sensorType.max - threshold.sensorType.min);
      const indicators = new Map <number, number> ();
      const min = threshold.sensorType.min;
      indicators.set(min, 0);
      indicators.set(threshold.sensorType.max, 100);
      threshold.thresholdItems.forEach(thresholdItem => {
        const fromPercent = (thresholdItem.range.from - min) * coef;
        const toPercent = (thresholdItem.range.to - min) * coef;
        thresholdItem.range['fromPercent'] = fromPercent;
        thresholdItem.range['toPercent'] = toPercent;
        thresholdItem.range['widthPercent'] = toPercent - fromPercent;
        indicators.set(thresholdItem.range.from, fromPercent);
        indicators.set(thresholdItem.range.to, toPercent);
      });
      threshold['indicators'] = indicators;

      // last values
      if (this.lastValues) {
        const lastSensorValues = [];
        this.lastValues.forEach(lastValue => {
          if (+lastValue.sensorTypeId === +threshold.sensorType.id) {
            lastSensorValues.push({
              name: lastValue.thingName,
              value: lastValue.value,
              percent: lastValue.value * coef
            });
          }
        });
        threshold['lastValues'] = lastSensorValues;
      }
    });
  }

}

