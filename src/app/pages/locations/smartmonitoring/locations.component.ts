import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { IGeolocation } from 'src/app/models/asset.model';


@Component({
  selector: 'pvf-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit {
  parentFormGroup: FormGroup;
  descriptionFormGroup: FormGroup;
  keyValues:[String, String, String][] = [];

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.parentFormGroup = this._formBuilder.group({
    });
    this.descriptionFormGroup = this._formBuilder.group({
      NameCtrl: ['', Validators.required],
      DescriptionCtrl: ['', Validators.required],
    });
  }

  onNotify(geolocation:IGeolocation) {
    console.log(geolocation);
  }

  addKeyValue(){
    this.keyValues.push(["", "", ""]);
  }

  removeKeyValue(index) {
    this.keyValues.splice(index,1);
  }
}