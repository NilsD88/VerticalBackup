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
    isSwaping: boolean
  }> = new EventEmitter();

  public drpPresets: Array<PresetItem> = [];
  public isSwaping = false;

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
    this.isSwaping = true;
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
    // Make toDate inclusive
    const {fromDate, toDate } = dateRange;
    const duration = moment.duration(moment(fromDate).diff(toDate));
    const durationInHours = +duration.asHours().toFixed(0);
    if (durationInHours > 24) {
      dateRange.toDate = new Date(moment(dateRange.toDate).add(1, 'day').valueOf());
    }
    this.dateChange.emit({
      dateRange,
      isSwaping: this.isSwaping
    });
    this.isSwaping = false;
  }
}


function setupPresets(drpPresets) {
  const backDate = (numOfDays) => {
    const tday = new Date();
    return new Date(tday.setDate(tday.getDate() - numOfDays));
  };

  const today = new Date();
  const minus7 = backDate(7);
  const minus30 = backDate(30);

  return [
    {presetLabel: 'Last 24 hours', range: {fromDate: moment().subtract(1, 'day').toDate(), toDate: moment().toDate()}},
    {presetLabel: 'Last 7 Days', range: {fromDate: minus7, toDate: today}},
    {presetLabel: 'Last 30 Days', range: {fromDate: minus30, toDate: today}}
  ];
}

function initDateFilterOptions(
  drpPresets,
  drpOptions,
  fromDate: Date = moment().subtract(1, 'day').toDate(),
  toDate: Date = moment().toDate()
  ): {drpPresets, drpOptions} {
  const today = new Date();
  const fromMax = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const toMax = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  drpPresets = setupPresets(drpPresets);
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