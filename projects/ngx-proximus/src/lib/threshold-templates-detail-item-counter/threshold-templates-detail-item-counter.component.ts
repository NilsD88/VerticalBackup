import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pxs-threshold-templates-detail-item-counter',
  templateUrl: './threshold-templates-detail-item-counter.component.html',
  styleUrls: ['./threshold-templates-detail-item-counter.component.scss']
})
export class ThresholdTemplatesDetailItemCounterComponent implements OnInit {

  @Input() sensor: any;

  constructor() { }

  ngOnInit() {

    const sensorType = this.sensor.sensorType;
    sensorType.min = this.sensor.thresholds[0].range.from;
    sensorType.max = this.sensor.thresholds[0].range.to;

    // Find min and max value
    for (const threshold of this.sensor.thresholds) {
      if (threshold.range.from < sensorType.min) {
        sensorType.min = threshold.range.from;
      }
      if (threshold.range.to < sensorType.min) {
        sensorType.min = threshold.range.to;
      }

      if (threshold.range.from > sensorType.max) {
        sensorType.max = threshold.range.from;
      }
      if (threshold.range.to > sensorType.max) {
        sensorType.max = threshold.range.to;
      }
    }

    console.log(sensorType);

    const coef = 100 / (sensorType.max - sensorType.min);
    const indicators = new Map <number, number> ();
    const min = sensorType.min;
    indicators.set(min, 0);
    indicators.set(sensorType.max, 100);
    this.sensor.thresholds.forEach(threshold => {
      const fromPercent = (threshold.range.from - min) * coef;
      const toPercent = (threshold.range.to - min) * coef;
      threshold.range['fromPercent'] = fromPercent;
      threshold.range['toPercent'] = toPercent;
      threshold.range['widthPercent'] = toPercent - fromPercent;
      indicators.set(threshold.range.from, fromPercent);
      indicators.set(threshold.range.to, toPercent);
    });
    this.sensor['indicators'] = indicators;
  }

}
