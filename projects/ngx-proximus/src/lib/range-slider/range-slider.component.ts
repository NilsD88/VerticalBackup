import {Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'pxs-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.css']
})
export class RangeSliderComponent implements OnInit {
  @Input() disabled = false;
  @Input() postfix = '';
  @Input() startFrom = 0;
  @Input() startTo = 100;
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;

  @Output() rangeChange: EventEmitter<[number, number]> = new EventEmitter();

  public range;

  constructor() {
  }

  ngOnInit() {
    this.range = [this.startFrom, this.startTo];
  }

  onUpdate(evt: number[]) {
    if (evt.length === 2) {
      this.range = [evt[0], evt[1]];
      this.rangeChange.emit(this.range);
    }
  }

}
