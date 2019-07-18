import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationsComponent } from './locations.component';
import {RouterModule} from '@angular/router';
import {LocationsRoutes} from './locations.routing';
import {MatStepperModule, MatInputModule, MatButtonModule, MatSelectModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapNewLocation } from '../../../../../projects/ngx-proximus/src/lib/map-new-location/map-new-location.module';

@NgModule({
  declarations: [
    LocationsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(LocationsRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MapNewLocation
  ]
})
export class LocationsModule { }
