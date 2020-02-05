import {Component, EventEmitter, OnInit, Output, Input, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {NgxDrpOptions, PresetItem} from 'ngx-mat-daterange-picker';

export interface DateRange {
  fromDate: Date;
  toDate: Date;
}

@Component({
  selector: 'pxs-date-range-selection',
  templateUrl: './date-range-selection.component.html',
  styleUrls: ['./date-range-selection.component.scss']
})
export class DateRangeSelectionComponent implements OnInit {
  @ViewChild('dateRangePicker', {static: false}) dateRangePicker;

  @Input() drpOptions: NgxDrpOptions;
  @Input() fromDate: Date;
  @Input() toDate: Date;

  @Output() dateChange: EventEmitter<{
    dateRange: DateRange,
    intervalNeedToChange: boolean
  }> = new EventEmitter();

  public drpPresets: Array<PresetItem> = [];
  public intervalNeedToChange = false;

  constructor() {
  }

  ngOnInit() {
    const result = initDateFilterOptions(this.drpPresets, this.drpOptions, this.fromDate, this.toDate);
    this.drpPresets = result.drpPresets;
    this.drpOptions = result.drpOptions;
  }

  swapPeriod(direction: boolean) {
    const {_fromDate, _toDate } = this.dateRangePicker.rangeStoreService;
    const duration = moment.duration(moment(_toDate).diff(_fromDate));
    this.intervalNeedToChange = false;
    if (direction) {
      this.dateRangePicker.resetDates({
        fromDate: new Date (moment(_fromDate).add(duration).valueOf()),
        toDate: new Date(moment(_toDate).add(duration).valueOf()),
      });
    } else {
      this.dateRangePicker.resetDates({
        fromDate: new Date (moment(_fromDate).subtract(duration).valueOf()),
        toDate: new Date(moment(_toDate).subtract(duration).valueOf()),
      });
    }
  }

  updateDrp(dateRange: DateRange) {
    const {fromDate, toDate } = dateRange;
    this.dateChange.emit({
      dateRange: {
        fromDate,
        toDate: toDate.getMilliseconds() > 0 ? toDate : moment(toDate).endOf('days').toDate()
      },
      intervalNeedToChange: this.intervalNeedToChange
    });
    this.intervalNeedToChange = true;
  }
}


function setupPresets() {
  const today = moment().startOf('day').toDate();
  return [
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
}

function initDateFilterOptions(
  drpPresets,
  drpOptions,
  fromDate: Date = moment().subtract(1, 'day').startOf('day').toDate(),
  toDate: Date = moment().startOf('day').toDate()
  ): {drpPresets, drpOptions} {
  const now = new Date();
  const fromMax = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const toMax = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  drpPresets = setupPresets();
  drpOptions = drpOptions || {
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

  return {
    drpPresets,
    drpOptions
  };
}