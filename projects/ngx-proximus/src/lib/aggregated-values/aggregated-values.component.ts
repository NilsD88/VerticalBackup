import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {isNullOrUndefined} from 'util';


@Component({
  selector: 'pxs-aggregated-values',
  templateUrl: './aggregated-values.component.html',
  styleUrls: ['./aggregated-values.component.scss']
})
export class AggregatedValuesComponent implements OnInit, OnChanges {

  @Input() data = [];

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
    if (this.data.length) {
      this.aggregatedValues = [];
      this.data.forEach((item) => {
        console.log(item);
        const aggregatedValue = this.createAggregatedValues(item);
        this.aggregatedValues.push(aggregatedValue);
      });
    }
  }

  public createAggregatedValues(data) {
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
      data.series.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);
      data.series.forEach((item) => {
        avg.push(item.avg);
        max.push(item.max);
        min.push(item.min);
      });

      let sum = 0;
      avg.forEach(item => {
        sum += parseFloat(item);
      });

      aggregatedValue.label = data.label ? data.label : '';
      aggregatedValue.max = (max.length > 0) ? Math.max(...max).toFixed(2) : null;
      aggregatedValue.min = (min.length > 0) ? Math.min(...min).toFixed(2) : null;
      aggregatedValue.average = (data.series.length > 0) ? (sum / data.series.length).toFixed(2) : null;
      aggregatedValue.standardDeviation = data.standardDeviation ? data.standardDeviation.toFixed(2) : null;
      aggregatedValue.postfix = data.postfix ? data.postfix : null;
    }

    console.log(aggregatedValue);


    return aggregatedValue;
  }

}
