import { Component, OnInit, Input } from '@angular/core';
import { INewThresholdTemplate } from 'src/app/models/new-threshold-template.model';

@Component({
  selector: 'pxs-threshold-templates-detail-item',
  templateUrl: './threshold-templates-detail-item.component.html',
  styleUrls: ['./threshold-templates-detail-item.component.scss']
})
export class ThresholdTemplatesDetailItemComponent implements OnInit {

  @Input() thresholdTemplate: INewThresholdTemplate;

  constructor() { }

  ngOnInit() {
    this.thresholdTemplate.sensors.forEach(sensor => {
      const coef = 100 / (sensor.sensorType.max - sensor.sensorType.min);
      const indicators = new Map <number, number> ();
      const min = sensor.sensorType.min;
      indicators.set(min, 0);
      indicators.set(sensor.sensorType.max, 100);
      sensor.thresholds.forEach(threshold => {
        const fromPercent = (threshold.range.from - min) * coef;
        const toPercent = (threshold.range.to - min) * coef;
        threshold.range['fromPercent'] = fromPercent;
        threshold.range['toPercent'] = toPercent;
        threshold.range['widthPercent'] = toPercent - fromPercent;
        indicators.set(threshold.range.from, fromPercent);
        indicators.set(threshold.range.to, toPercent);
      });
      sensor['indicators'] = indicators;
    });
  }

}

