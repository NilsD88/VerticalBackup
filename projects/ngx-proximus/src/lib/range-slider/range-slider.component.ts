import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

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

  from:number;
  to:number;

  @Output() change: EventEmitter<{ from: number, to: number }> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    this.from = this.startFrom;
    this.to = this.startTo;
  }

  sliderChange(evt: number[]) {
    if(evt.length === 2){
      this.from = evt[0];
      this.to = evt[1];
      this.change.emit({
        from: this.from,
        to: this.to
      });
    }
  }

}
