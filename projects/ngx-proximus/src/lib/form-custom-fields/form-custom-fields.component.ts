import { TranslateService } from '@ngx-translate/core';
import { IField, IFieldLabel } from './../../../../../src/app/models/field.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pxs-form-custom-fields',
  templateUrl: './form-custom-fields.component.html',
  styleUrls: ['./form-custom-fields.component.scss']
})
export class FormCustomFieldsComponent implements OnInit {

  public customFieldsValue;

  @Input() fields: IField [];
  @Input() customFields: {};
  @Output() customFieldsChange: EventEmitter<{}> = new EventEmitter<{}>();

  constructor(
    public translateService: TranslateService
  ) { }

  ngOnInit() {}

  getLabelName(label: IFieldLabel ) {
    const langs = ['en', 'fr', 'nl'];
    const currentLang = this.translateService.currentLang;
    let fieldName = label[currentLang];
    langs.splice(langs.indexOf(currentLang), 1 );
    while (!fieldName && langs.length) {
      fieldName = label[langs.splice(0, 1)[0]];
    }
    return fieldName;
  }

}


