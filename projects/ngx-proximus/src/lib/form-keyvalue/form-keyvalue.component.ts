import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'pxs-form-keyvalue',
  templateUrl: './form-keyvalue.component.html',
  styleUrls: ['./form-keyvalue.component.scss']
})
export class FormKeyvalueComponent implements OnInit {

  @Input() parentFormGroup: FormGroup;

  keyValues: [string, string, string, number][] = [];

  constructor() { }

  ngOnInit() {
  }


  addKeyValue() {
    const id = new Date().getTime();
    this.keyValues.push(['', '', '', id]);
    this.parentFormGroup.addControl(
      `kv_k${id}`, new FormControl('', Validators.required)
    );
    this.parentFormGroup.addControl(
      `kv_v${id}`, new FormControl('', Validators.required)
    );
  }

  removeKeyValue(index) {
    const id = this.keyValues[index][3];
    this.parentFormGroup.removeControl(`kv_k${id}`);
    this.parentFormGroup.removeControl(`kv_kc${id}`);
    this.parentFormGroup.removeControl(`kv_v${id}`);
    this.keyValues.splice(index, 1);
  }

  updateKey(id, value) {
    if (value !== 'other') {
      this.parentFormGroup.removeControl(`kv_kc${id}`);
    } else {
      this.parentFormGroup.addControl(
        `kv_kc${id}`, new FormControl('', Validators.required)
      );
    }
  }

}
