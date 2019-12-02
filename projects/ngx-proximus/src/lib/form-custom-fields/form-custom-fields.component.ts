import { TranslateService } from '@ngx-translate/core';
import { IField } from './../../../../../src/app/models/field.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pxs-form-custom-fields',
  templateUrl: './form-custom-fields.component.html',
  styleUrls: ['./form-custom-fields.component.scss']
})
export class FormCustomFieldsComponent implements OnInit {

  public customFieldsValue;

  @Input() fields: IField;
  @Input() customFields: {};
  @Output() customFieldsChange: EventEmitter<{}> = new EventEmitter<{}>();

  constructor(
    public translateService: TranslateService
  ) { }

  ngOnInit() {}

}
