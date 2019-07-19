import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { IGeolocation } from 'src/app/models/asset.model';


@Component({
  selector: 'pvf-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlaygroundComponent implements OnInit {

  @ViewChild('inputLat') inputLat: ElementRef;
  @ViewChild('inputLng') inputLng: ElementRef;
  
  descriptionFormGroup: FormGroup;
  geolocationFormGroup: FormGroup;
  floorPlan: String;



  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.descriptionFormGroup = this._formBuilder.group({
      NameCtrl: ['', Validators.required],
      DescriptionCtrl: ['', Validators.required],
      TypeCtrl: ['', null],
    });
    this.geolocationFormGroup = this._formBuilder.group({
      longitudeCtrl: ['', Validators.required],
      latitudeCtrl: ['', Validators.required],
    });
  }
  

  submit() {
    console.log(this.descriptionFormGroup);
    console.log(this.geolocationFormGroup);
    console.log(this.floorPlan);
  }
}