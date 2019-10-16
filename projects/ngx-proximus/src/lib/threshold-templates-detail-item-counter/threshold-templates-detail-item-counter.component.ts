import { Component, OnInit, Input } from '@angular/core';
import { IThresholdWithLastValuesAndIndicators } from 'src/app/models/g-threshold.model';

@Component({
  selector: 'pxs-threshold-templates-detail-item-counter',
  templateUrl: './threshold-templates-detail-item-counter.component.html',
  styleUrls: ['./threshold-templates-detail-item-counter.component.scss']
})
export class ThresholdTemplatesDetailItemCounterComponent implements OnInit {

  @Input() threshold: IThresholdWithLastValuesAndIndicators;

  constructor() { }

  ngOnInit() {

    const sensorType = this.threshold.sensorType;
    sensorType.min = this.threshold.thresholdItems[0].range.from;
    sensorType.max = this.threshold.thresholdItems[0].range.to;

    // Find min and max value
    for (const thresholdItem of this.threshold.thresholdItems) {
      if (thresholdItem.range.from < sensorType.min) {
        sensorType.min = thresholdItem.range.from;
      }
      if (thresholdItem.range.to < sensorType.min) {
        sensorType.min = thresholdItem.range.to;
      }

      if (thresholdItem.range.from > sensorType.max) {
        sensorType.max = thresholdItem.range.from;
      }
      if (thresholdItem.range.to > sensorType.max) {
        sensorType.max = thresholdItem.range.to;
      }
    }

    console.log(sensorType);

    const coef = 100 / (sensorType.max - sensorType.min);
    const indicators = new Map <number, number> ();
    const min = sensorType.min;
    indicators.set(min, 0);
    indicators.set(sensorType.max, 100);
    this.threshold.thresholdItems.forEach(thresholdItem => {
      const fromPercent = (thresholdItem.range.from - min) * coef;
      const toPercent = (thresholdItem.range.to - min) * coef;
      thresholdItem.range = {
        ...thresholdItem.range,
        fromPercent,
        toPercent,
        widthPercent: toPercent - fromPercent
      };
      indicators.set(thresholdItem.range.from, fromPercent);
      indicators.set(thresholdItem.range.to, toPercent);
    });
    this.threshold.indicators = indicators;
  }

}
