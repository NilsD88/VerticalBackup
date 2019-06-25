import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'pxs-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.css']
})
export class RangeSliderComponent implements OnInit {
  @Input() disabled = false;
  @Input() postfix = '';
  @Input() from = 0;
  @Input() to = 100;
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;

  @Output() change: EventEmitter<{ from: number, to: number }> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  sliderChange(evt: number[]) {
    this.change.emit({
      from: evt[0],
      to: evt[1]
    });
  }

}
