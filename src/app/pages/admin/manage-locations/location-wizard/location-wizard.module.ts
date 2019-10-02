import { NgModule } from '@angular/core';
import { LocationWizardComponent } from './location-wizard.component';
import { RouterModule } from '@angular/router';
import { LocationWizardRoutes } from './location-wizard.routing';
import { MatStepperModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDialogModule } from '@angular/material';
import { StepperNextModule } from 'projects/ngx-proximus/src/lib/stepper-next/stepper-next.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapNewLocation } from 'projects/ngx-proximus/src/lib/map-new-location/map-new-location.module';
import { FormKeyvalueModule } from 'projects/ngx-proximus/src/lib/form-keyvalue/form-keyvalue.module';
import { FormGeolocationModule } from 'projects/ngx-proximus/src/lib/form-geolocation/form-geolocation.module';
import { EditableImageModule } from 'projects/ngx-proximus/src/lib/editable-image/editable-image.module';
import { LocationExplorerModule } from 'projects/ngx-proximus/src/lib/location-explorer/location-explorer.module';
import { CommonModule } from '@angular/common';
import { NewLocationService } from 'src/app/services/new-location.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(LocationWizardRoutes),
    MatStepperModule,
    StepperNextModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MapNewLocation,
    FormKeyvalueModule,
    FormGeolocationModule,
    EditableImageModule,
    LocationExplorerModule,
    MatDialogModule,
  ],
  exports: [],
  declarations: [
    LocationWizardComponent
  ],
  providers: [
    NewLocationService
  ],
})

export class LocationWizardModule { }
