import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { IGeolocation } from 'src/app/models/asset.model';
import { FormGroup } from '@angular/forms';
import { INewLocation } from 'src/app/models/new-location';

@Component({
  selector: 'pxs-form-geolocation',
  templateUrl: './form-geolocation.component.html',
  styleUrls: ['./form-geolocation.component.scss']
})
export class FormGeolocationComponent implements OnInit {

  @Input() location: INewLocation;
  @Input() geolocation: IGeolocation;
  @Input() parentFormGroup: FormGroup;
  @Output() notify: EventEmitter<IGeolocation> = new EventEmitter<IGeolocation>();

  ngOnInit() {}

  onNotify(geolocation: IGeolocation) {
    this.notify.emit(geolocation);
  }

}
