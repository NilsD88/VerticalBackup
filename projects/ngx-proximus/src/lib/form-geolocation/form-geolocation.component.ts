import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { IGeolocation } from 'src/app/models/asset.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'pxs-form-geolocation',
  templateUrl: './form-geolocation.component.html',
  styleUrls: ['./form-geolocation.component.scss']
})
export class FormGeolocationComponent implements OnInit {

  @Input() parentFormGroup:FormGroup;
  @ViewChild('inputLat') inputLat: ElementRef;
  @ViewChild('inputLng') inputLng: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  onNotify(geolocation:IGeolocation) {
    this.inputLat.nativeElement.value = geolocation.lat;
    this.inputLat.nativeElement.dispatchEvent(new Event('change'));
    this.inputLng.nativeElement.value = geolocation.lng;
    this.inputLng.nativeElement.dispatchEvent(new Event('change'));
  }

}
