import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {isNullOrUndefined} from 'util';


@Component({
  selector: 'pxs-aggregated-values',
  templateUrl: './aggregated-values.component.html',
  styleUrls: ['./aggregated-values.component.scss']
})
export class AggregatedValuesComponent implements OnInit, OnChanges {

  @Input() chartData = [];
  @Input() standardDeviations: {
    sensorType: string;
    value: number;
  }[] = [];

  public aggregatedValues: {
    label: string;
    average: string;
    min: string;
    max: string;
    standardDeviation: string;
    postfix: string
  }[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chartData.length) {
      this.chartData.forEach((item) => {
        const aggregatedValue = this.createAggregatedValues(item, `${item.label} ${item.devEui}`);
        this.aggregatedValues.push(aggregatedValue);
      });
    }
  }

  public createAggregatedValues(data, labelTranslation: string) {
    const aggregatedValue: {
      label: string;
      max: string;
      min: string;
      average: string;
      standardDeviation: string;
      postfix: string
    } = {
      label: '',
      max: '',
      min: '',
      average: '',
      standardDeviation: '',
      postfix: ''
    };

    const avg = [];
    const max = [];
    const min = [];

    if (!isNullOrUndefined(data.series)) {
      data.series.forEach((item) => {
        avg.push(item.avg);
        max.push(item.max);
        min.push(item.min);
      });

      let sum = 0;
      avg.forEach(item => {
        sum += parseFloat(item);
      });

      aggregatedValue.label = labelTranslation;
      aggregatedValue.max = (max.length > 0) ? Math.max(...max).toFixed(2) : null;
      aggregatedValue.min = (min.length > 0) ? Math.min(...min).toFixed(2) : null;
      aggregatedValue.average = (data.series.length > 0) ? (sum / data.series.length).toFixed(2) : null;

      const retrievedStandardDeviation = this.standardDeviations.find(standardDeviation => {
        return standardDeviation.sensorType === data.label;
      });
      if (retrievedStandardDeviation) {
        aggregatedValue.standardDeviation = retrievedStandardDeviation.value.toFixed(2);
      }
    }

    return aggregatedValue;
  }

}
