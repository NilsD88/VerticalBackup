import {Component, OnInit} from '@angular/core';
import {AlertDefinitionService} from 'src/app/services/alert-definition.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'pvf-alert-definition',
  templateUrl: './alert-definition.component.html',
  styleUrls: ['./alert-definition.component.scss']
})
export class AlertDefinitionComponent implements OnInit {

  public itemsLoading = false;
  public Editor = ClassicEditor;

  get alertSmsDefinition() {
    return {
      recipients: this.alertDefinitionModel.sms.recipients.map((item) => {
        return item.value;
      }).filter((item) => {
        return item.length > 0;
      }).join(';'),
      body: this.alertDefinitionModel.sms.body,
      enabled: this.alertDefinitionModel.sms.enabled
    };
  }

  set alertSmsDefinition(def: any) {
    const smsRecipients = def.recipients.split(';');

    this.alertDefinitionModel.sms = {
      recipients: smsRecipients.map((item) => {
        return {value: item};
      }),
      body: def.body,
      enabled: def.enabled
    };
  }

  get alertMailDefinition() {
    return {
      recipients: this.alertDefinitionModel.email.recipients.map((item) => {
        return item.value;
      }).filter((item) => {
        return item.length > 0;
      }).join(';'),
      body: this.alertDefinitionModel.email.body,
      subject: this.alertDefinitionModel.email.subject,
      enabled: this.alertDefinitionModel.email.enabled
    };
  }

  set alertMailDefinition(def: any) {
    const emailRecipients = def.recipients.split(';');

    this.alertDefinitionModel.email = {
      recipients: emailRecipients.map((item) => {
        return {value: item};
      }),
      body: def.body,
      subject: def.subject,
      enabled: def.enabled
    };
  }

  public alertDefinitionModel = {
    id: null,
    name: null,
    organizationId: null,
    email: {
      recipients: [],
      body: '',
      subject: '',
      enabled: false
    },
    sms: {
      recipients: [],
      body: '',
      enabled: false
    }
  };


  placeholders = {
    asset: [
      {label: 'FILTERS.ASSET_NAME', value: '%assetName%'},
      {label: 'FILTERS.LOCATION_NAME', value: '%locationName%'},
    ],
    log: [
      {label: 'FILTERS.THING_NAME', value: '%thingName%'},
      {label: 'FILTERS.DEVICE_ID', value: '%devEui%'},
      {label: 'GENERAL.TIMESTAMP', value: '%timestamp%'},
      {label: 'GENERAL.VALUE', value: '%value%'}
    ],
    threshold: [
      {label: 'FILTERS.THRESHOLD_TEMPLATE_NAME', value: '%thresholdTemplateName%'},
      {label: 'FILTERS.SENSOR_TYPE_NAME', value: '%sensorTypeName%'},
      {label: 'THRESHOLD_TEMPLATE.THRESHOLD_ITEM_LABEL', value: '%thresholdItemLabel%'}, // SEVERITY IF NO LABEL
      {label: 'THRESHOLD_TEMPLATE.THRESHOLD_ITEM_MIN', value: '%thresholdItemMin%'},
      {label: 'THRESHOLD_TEMPLATE.THRESHOLD_ITEM_MAX', value: '%thresholdItemMax%'},
    ]
  };

  activePlaceholders = this.placeholders.asset;

  constructor(public alertDefinitionsService: AlertDefinitionService) {
  }

  async ngOnInit() {
    this.itemsLoading = true;
    const alertDef = await this.alertDefinitionsService.getDefaultAlertDefinition();
    this.alertDefinitionModel.id = alertDef.id;
    this.alertDefinitionModel.organizationId = alertDef.organizationId;
    this.alertDefinitionModel.name = alertDef.name;
    this.alertSmsDefinition = alertDef.sms;
    this.alertMailDefinition = alertDef.email;
    this.itemsLoading = false;
  }

  addPlaceholder(value: string, type: 'email' | 'sms') {
    switch (type) {
      case 'email':
        this.alertDefinitionModel.email.body += ` ${value} `;
        break;
      case 'sms':
        this.alertDefinitionModel.sms.body += ` ${value} `;
        break;
    }
  }

  public updateAlertDefinition(field: 'sms' | 'email' | 'assets') {
    this.alertDefinitionsService.updateDefaultAlertDefinition({
        name: this.alertDefinitionModel.name,
        id: this.alertDefinitionModel.id,
        organizationId: this.alertDefinitionModel.organizationId,
        sms: this.alertSmsDefinition,
        email: this.alertMailDefinition
      })
      .then((result) => {
        this.alertMailDefinition = result.email;
        this.alertSmsDefinition = result.sms;
      });
  }

  addRecipient(type: 'email' | 'sms') {
    switch (type) {
      case 'email':
        this.alertDefinitionModel.email.recipients.push({value: ''});
        break;
      case 'sms':
        this.alertDefinitionModel.sms.recipients.push({value: ''});
        break;
    }
  }

  deleteRecipient(type: 'email' | 'sms', index: number) {
    switch (type) {
      case 'email':
        this.alertDefinitionModel.email.recipients.splice(index, 1);
        break;
      case 'sms':
        this.alertDefinitionModel.sms.recipients.splice(index, 1);
        break;
    }
  }
}
