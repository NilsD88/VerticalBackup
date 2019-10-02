import { Component, OnInit, Input } from '@angular/core';
import { IThreshold } from 'src/app/models/g-threshold.model';

@Component({
  selector: 'pxs-threshold-templates-detail-item-number',
  templateUrl: './threshold-templates-detail-item-number.component.html',
  styleUrls: ['./threshold-templates-detail-item-number.component.scss']
})
export class ThresholdTemplatesDetailItemNumberComponent implements OnInit {

  @Input() threshold: IThreshold;
  constructor() { }

  ngOnInit() {
    const sensorType = this.threshold.sensorType;
    const coef = 100 / (sensorType.max - sensorType.min);
    const indicators = new Map <number, number> ();
    const min = sensorType.min;
    indicators.set(min, 0);
    indicators.set(sensorType.max, 100);
    this.threshold.thresholdItems.forEach(thresholdItem => {
      const fromPercent = (thresholdItem.range.from - min) * coef;
      const toPercent = (thresholdItem.range.to - min) * coef;
      thresholdItem.range['fromPercent'] = fromPercent;
      thresholdItem.range['toPercent'] = toPercent;
      thresholdItem.range['widthPercent'] = toPercent - fromPercent;
      indicators.set(thresholdItem.range.from, fromPercent);
      indicators.set(thresholdItem.range.to, toPercent);
    });
    this.threshold['indicators'] = indicators;
  }

}
