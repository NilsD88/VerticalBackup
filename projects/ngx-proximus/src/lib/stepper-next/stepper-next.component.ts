import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'pxs-stepper-next',
  templateUrl: './stepper-next.component.html',
  styleUrls: ['./stepper-next.component.scss']
})
export class StepperNextComponent implements OnInit {

  @Input() completed = true;
  @Input() text;
  @Input() color = 'primary';
  @Input() formGroup: FormGroup = new FormGroup({});
  @Input() loading: boolean;
  @Input() showCancel = false;
  @Output() next = new EventEmitter();
  @Output() cancel = new EventEmitter();


  constructor(
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    if (!this.text) {
      this.text = this.translateService.instant('LAYOUT.NEXT');
    }
  }

  callCancel() {
    this.cancel.emit();
  }

  callNext() {
    this.next.emit();
  }

}
