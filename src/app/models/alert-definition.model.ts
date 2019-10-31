import {isNullOrUndefined} from 'util';

export interface IAlertDefinitionEmail {
  recipients: string;
  body: string;
  subject: string;
  enabled: boolean;
}

export interface IAlertDefinitionSms {
  recipients: string;
  body: string;
  enabled: boolean;
}

export interface IAlertDefinition {
  id?: string | number;
  name: string;
  organizationId: number;
  email: IAlertDefinitionEmail;
  sms: IAlertDefinitionSms;
}

export class AlertDefinitionSms implements IAlertDefinitionSms {
  recipients: string;
  body: string;
  enabled: boolean;
  constructor(private _alertDefinitionSms: IAlertDefinitionSms) {
    if (!isNullOrUndefined(_alertDefinitionSms)) {
      this.recipients = _alertDefinitionSms.recipients ? _alertDefinitionSms.recipients : '';
      this.body = _alertDefinitionSms.body ? _alertDefinitionSms.body : '';
      this.enabled = _alertDefinitionSms.enabled ? _alertDefinitionSms.enabled : false;
    } else {
      this.recipients = '';
      this.body = '';
      this.enabled = false;
    }
  }

}

export class AlertDefinitionEmail implements IAlertDefinitionEmail {
  recipients: string;
  body: string;
  subject: string;
  enabled: boolean;

  constructor(private _alertDefinitionEmail: IAlertDefinitionEmail) {
    if (!isNullOrUndefined(_alertDefinitionEmail)) {
      this.recipients = _alertDefinitionEmail.recipients ? _alertDefinitionEmail.recipients : '';
      this.body = _alertDefinitionEmail.body ? _alertDefinitionEmail.body : '';
      this.subject = _alertDefinitionEmail.subject ? _alertDefinitionEmail.subject : '';
      this.enabled = _alertDefinitionEmail.enabled ? _alertDefinitionEmail.enabled : false;
    } else {
      this.recipients = '';
      this.body = '';
      this.subject = '';
      this.enabled = false;
    }
  }

}

export class AlertDefinition implements IAlertDefinition {
  public id: string | number;
  public name: string;
  public organizationId: number;
  email: IAlertDefinitionEmail;
  sms: IAlertDefinitionSms;

  constructor(private _alertDefinition: IAlertDefinition) {
    if (!isNullOrUndefined(_alertDefinition)) {
      this.id = _alertDefinition.id ? _alertDefinition.id : null;
    } else {
      this.id = null;
    }
    this.organizationId = _alertDefinition.organizationId;
    this.name = _alertDefinition.name;
    this.email = new AlertDefinitionEmail(_alertDefinition ? _alertDefinition.email : null);
    this.sms = new AlertDefinitionSms(_alertDefinition ? _alertDefinition.sms : null);
  }

  public static createArray(values: IAlertDefinition[]): AlertDefinition[] {
    if (!isNullOrUndefined(values)) {
      return values.map((value) => {
        return new AlertDefinition(value);
      });
    } else {
      return [];
    }
  }
}




