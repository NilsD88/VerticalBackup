import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { ContactService } from 'src/app/services/contact.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'pvf-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  public assetPrefix = environment.assetPrefix;
  public contactFG: FormGroup;
  public contactModel: { name: string; email: string; message: string } = {
    name: '',
    email: '',
    message: ''
  };

  get contact() {
    return {
      name: this.contactFG.get('name').value,
      email: this.contactFG.get('email').value,
      message: this.contactFG.get('message').value
    };
  }

  constructor(
              private formBuilder: FormBuilder,
              public sharedService: SharedService,
              public contactService: ContactService) {
  }

  ngOnInit() {
    if (this.sharedService.user && this.sharedService.user.exists) {
      const user = this.sharedService.user;
      this.contactModel.email = user.email ? user.email : '';
    } else {
      this.contactModel.email = '';
    }

    this.contactFG = this.formBuilder.group({
      name: new FormControl(this.contactModel.name, [
        Validators.required
      ]),
      message: new FormControl(this.contactModel.message, [
        Validators.required,
        Validators.minLength(50),
        Validators.maxLength(2048)

      ]),
      email: new FormControl(this.contactModel.email, [
        Validators.required,
        Validators.email,
      ])
    });
  }

  public resetForm() {
    this.ngOnInit();
  }

  public async submit() {
    try {
      await this.contactService.sendSupportMessage(this.contact);
      this.resetForm();
    } catch (err) {
      console.error(err);
    }
  }
}
