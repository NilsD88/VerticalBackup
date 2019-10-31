import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IGeolocation } from 'src/app/models/geolocation.model';
import { FormGroup } from '@angular/forms';
import { ILocation } from 'src/app/models/g-location.model';

@Component({
  selector: 'pxs-form-geolocation',
  templateUrl: './form-geolocation.component.html',
  styleUrls: ['./form-geolocation.component.scss']
})
export class FormGeolocationComponent implements OnInit {

  @Input() location: ILocation;
  @Input() geolocation: IGeolocation;
  @Input() parentFormGroup: FormGroup;
  @Output() notify: EventEmitter<IGeolocation> = new EventEmitter<IGeolocation>();

  ngOnInit() {}

  onNotify(geolocation: IGeolocation) {
    this.notify.emit(geolocation);
  }

}
