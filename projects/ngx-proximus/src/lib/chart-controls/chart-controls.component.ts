import * as moment from 'moment';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgxDrpOptions } from 'ngx-mat-daterange-picker';


interface IFilterChartData {
  interval?: string;
  from?: number;
  to?: number;
  durationInHours?: number;
}

export type Intervals = 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
export interface PeriodicDuration {
  interval: Intervals;
  from: number;
  to: number;
}


@Component({
  selector: 'pxs-chart-controls',
  templateUrl: './chart-controls.component.html',
  styleUrls: ['./chart-controls.component.scss']
})
export class ChartControlsComponent implements OnInit {

  @Input() filter: IFilterChartData;
  @Input() chartDataIsLoading: boolean;
  @Input() chartDataLength: number;
  @Input() drpOptions: NgxDrpOptions;

  @Output() intervalChanged: EventEmitter<any> = new EventEmitter();
  @Output() dateRangeChanged: EventEmitter<PeriodicDuration> = new EventEmitter();
  @Output() downloadPDF: EventEmitter<null> = new EventEmitter();
  @Output() downloadCSV: EventEmitter<null> = new EventEmitter();

  public intervals: Intervals[] = ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];


  constructor() { }

  ngOnInit() {
  }

  public dateRangeChange(range: { fromDate: Date; toDate: Date; }) {
    const {fromDate, toDate} = range;
    const duration = moment.duration(moment(toDate).diff(fromDate));
    const durationHours =  +duration.asHours().toFixed(0);
    let interval: Intervals = 'HOURLY';

    if (durationHours > 24) {
      const durationDays =  +duration.asDays().toFixed(0);
      if (durationDays >= 4) {
        interval = 'DAILY';
        const durationWeeks =  +duration.asWeeks().toFixed(0);
        if (durationWeeks >= 4) {
          interval = 'WEEKLY';
          const durationMonths =  +duration.asMonths().toFixed(0);
          if (durationMonths >= 4) {
            interval = 'YEARLY';
          }
        }
      }
    }

    this.dateRangeChanged.emit({
      interval,
      from: fromDate.getTime(),
      to: toDate.getTime(),
    });
  }

}
