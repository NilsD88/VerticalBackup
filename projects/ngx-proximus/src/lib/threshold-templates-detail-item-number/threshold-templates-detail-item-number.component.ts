import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pxs-threshold-templates-detail-item-number',
  templateUrl: './threshold-templates-detail-item-number.component.html',
  styleUrls: ['./threshold-templates-detail-item-number.component.scss']
})
export class ThresholdTemplatesDetailItemNumberComponent implements OnInit {

  @Input() sensor: any;
  constructor() { }

  ngOnInit() {
    const sensorType = this.sensor.sensorType;
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
