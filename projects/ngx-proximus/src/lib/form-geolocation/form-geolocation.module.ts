import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGeolocationComponent } from './form-geolocation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatFormFieldModule } from '@angular/material';
import { MapNewLocation } from '../map-new-location/map-new-location.module'

@NgModule({
  declarations: [FormGeolocationComponent],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    MatInputModule, 
    MatFormFieldModule,
    MapNewLocation
  ],
  exports: [
    FormGeolocationComponent
  ]
})
export class FormGeolocationModule { }
