import * as moment from 'moment';
import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { NgxDrpOptions } from 'ngx-mat-daterange-picker';


export interface IFilterChartData {
  interval?: Intervals;
  from?: number;
  to?: number;
  durationInHours?: number;
}

export type Intervals = 'ALL' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
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
  @Input() showExportOptions = true;
  @Input() minimumIntervals: Intervals[] = ['ALL', 'HOURLY'];

  @Output() intervalChanged: EventEmitter<any> = new EventEmitter();
  @Output() dateRangeChanged: EventEmitter<PeriodicDuration> = new EventEmitter();
  @Output() downloadPDF: EventEmitter<null> = new EventEmitter();
  @Output() downloadCSV: EventEmitter<null> = new EventEmitter();

  public intervals: Intervals[] = ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
  public drpOptions: NgxDrpOptions;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.initDateFilterOptions(new Date(this.filter.from), new Date(this.filter.to));
  }

  public initDateFilterOptions(fromDate: Date, toDate: Date) {
    const now = new Date();
    const fromMax = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const toMax = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const today = moment().startOf('day').toDate();
    const drpPresets = [
      {presetLabel: 'Last 24 hours', range: {
        fromDate: moment().subtract(1, 'day').toDate(), toDate: moment().toDate()
      }},
      {presetLabel: 'Last 7 Days', range: {
        fromDate: moment().subtract(7, 'day').startOf('day').toDate(), toDate: today
      }},
      {presetLabel: 'Last 30 Days', range: {
        fromDate: moment().subtract(30, 'day').startOf('day').toDate(), toDate: today
      }}
    ];

    this.drpOptions = this.drpOptions || {
      presets: drpPresets,
      format: 'mediumDate',
      range: {fromDate, toDate},
      applyLabel: 'Submit',
      calendarOverlayConfig: {
        shouldCloseOnBackdropClick: true
      },
      cancelLabel: 'Cancel',
      excludeWeekends: false,
      fromMinMax: {fromDate: null, toDate: fromMax},
      toMinMax: {fromDate: null, toDate: toMax}
    };
  }

  public dateRangeChange(dateRange: { fromDate: Date; toDate: Date; }, intervalNeedToChange: boolean) {
    const {fromDate, toDate} = dateRange;
    const duration = moment.duration(moment(toDate).diff(fromDate));
    const durationHours =  +duration.asHours().toFixed(0);

    let interval: Intervals = this.filter.interval;
    if (intervalNeedToChange) {
      this.intervals = this.minimumIntervals;
      interval = this.minimumIntervals[0];
      if (durationHours > 24) {
        this.intervals = ['HOURLY', 'DAILY', 'WEEKLY'];
        interval = 'HOURLY';
        const durationDays =  +duration.asDays().toFixed(0);
        if (durationDays > 7) {
          this.intervals = ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'];
          interval = 'DAILY';
          const durationWeeks =  +duration.asWeeks().toFixed(0);
          if (durationWeeks > 8) {
            this.intervals = ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
            interval = 'WEEKLY';
            const durationMonths =  +duration.asMonths().toFixed(0);
            if (durationMonths > 48) {
              interval = 'YEARLY';
            }
          }
        }
      }
    }

    this.changeDetectorRef.detectChanges();
    this.dateRangeChanged.emit({
      interval,
      from: fromDate.getTime(),
      to: toDate.getTime(),
    });
  }

}
