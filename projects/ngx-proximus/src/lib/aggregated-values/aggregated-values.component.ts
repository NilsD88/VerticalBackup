import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'pxs-aggregated-values',
  templateUrl: './aggregated-values.component.html',
  styleUrls: ['./aggregated-values.component.css']
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
    standardDeviation: string
  }[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.aggregatedValues.length && this.chartData.length) {
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
    } = {
      label: '',
      max: '',
      min: '',
      average: '',
      standardDeviation: ''
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
      aggregatedValue.max = Math.max(...max).toFixed(2);
      aggregatedValue.min = Math.min(...min).toFixed(2);
      aggregatedValue.average = (sum / avg.length).toFixed(2);
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
