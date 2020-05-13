import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { IField, ICustomField } from './../../../../../src/app/models/field.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pxs-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.scss']
})
export class CustomFieldsComponent implements OnInit {

  @Input() fields: IField [];
  @Input() customFields: ICustomField[] = [];

  private lang: string;

  constructor(
    public translateService: TranslateService
  ) { }

  ngOnInit() {
    this.lang = this.translateService.currentLang;
    this.addLabelsToCustomFiels();
    this.translateService.onLangChange.subscribe(
      (langChangeEvent: LangChangeEvent) => {
        this.lang = langChangeEvent.lang;
        this.addLabelsToCustomFiels();
      }
    );
  }


  addLabelsToCustomFiels() {
    this.customFields.forEach(customField => {
      const label = ((this.fields || []).find(x => x.id === customField.keyId) || {}).label || {};
      const langs = [...this.translateService.langs];
      let fieldName = label[this.lang];
      langs.splice(langs.indexOf(this.lang), 1);
      while (!fieldName && langs.length) {
        fieldName = label[langs.splice(0, 1)[0]];
      }
      customField.label = fieldName;
    });
  }
}


