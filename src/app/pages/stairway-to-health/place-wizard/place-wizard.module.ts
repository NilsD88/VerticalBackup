import { DialogComponent } from 'projects/ngx-proximus/src/lib/dialog/dialog.component';
import { FormCustomFieldsModule } from 'projects/ngx-proximus/src/lib/form-custom-fields/form-custom-fields.module';
import { LocationWizardDialogModule } from 'src/app/pages/admin/manage-locations/location-wizard/locationWizardDialog.module';
import { LocationWizardDialogComponent } from 'src/app/pages/admin/manage-locations/location-wizard/locationWizardDialog.component';
import { IconModule } from 'projects/ngx-proximus/src/lib/icon/icon.module';
import { NgModule } from '@angular/core';
import { PlaceWizardComponent } from './place-wizard.component';
import { RouterModule } from '@angular/router';
import { PlaceWizardRoutes } from './place-wizard.routing';
import { MatStepperModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDialogModule } from '@angular/material';
import { StepperNextModule } from 'projects/ngx-proximus/src/lib/stepper-next/stepper-next.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapNewLocation } from 'projects/ngx-proximus/src/lib/map-new-location/map-new-location.module';
import { FormKeyvalueModule } from 'projects/ngx-proximus/src/lib/form-keyvalue/form-keyvalue.module';
import { FormGeolocationModule } from 'projects/ngx-proximus/src/lib/form-geolocation/form-geolocation.module';
import { EditableImageModule } from 'projects/ngx-proximus/src/lib/editable-image/editable-image.module';
import { LocationExplorerModule } from 'projects/ngx-proximus/src/lib/location-explorer/location-explorer.module';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PeopleCountingAssetWizardDialogModule } from 'src/app/shared/people-counting/asset-wizard/assetWizardDialog.module';
import { PeopleCountingAssetWizardDialogComponent } from 'src/app/shared/people-counting/asset-wizard/assetWizardDialog.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PlaceWizardRoutes),
    MatStepperModule,
    StepperNextModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MapNewLocation,
    FormKeyvalueModule,
    FormGeolocationModule,
    EditableImageModule,
    LocationExplorerModule,
    LocationWizardDialogModule,
    PeopleCountingAssetWizardDialogModule,
    DragDropModule,
    IconModule,
    FormCustomFieldsModule
  ],
  exports: [PlaceWizardComponent],
  declarations: [
    PlaceWizardComponent
  ],
  entryComponents: [
    PeopleCountingAssetWizardDialogComponent,
    LocationWizardDialogComponent,
    DialogComponent
  ]
})

export class PlaceWizardModule { }
