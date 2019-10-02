import { ListThresholdTemplatesModule } from './../../../../../../../projects/ngx-proximus/src/lib/list-threshold-templates/list-threshold-templates.module';
import { ListThingsModule } from './../../../../../../../projects/ngx-proximus/src/lib/list-things/list-things.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetWizardComponent } from './asset-wizard.component';
import {RouterModule} from '@angular/router';
import {AssetWizardRoutes} from './asset-wizard.routing';
import { MatStepperModule, MatInputModule, MatButtonModule, MatSelectModule, MatListModule, MatDialogModule } from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {IconModule} from '../../../../../../../projects/ngx-proximus/src/lib/icon/icon.module';
import { FormKeyvalueModule } from '../../../../../../../projects/ngx-proximus/src/lib/form-keyvalue/form-keyvalue.module';
import { FormGeolocationModule } from '../../../../../../../projects/ngx-proximus/src/lib/form-geolocation/form-geolocation.module';
import { EditableImageModule } from '../../../../../../../projects/ngx-proximus/src/lib/editable-image/editable-image.module';
import { LocationExplorerModule } from 'projects/ngx-proximus/src/lib/location-explorer/location-explorer.module';
import { ThingService } from 'src/app/services/thing.service';
import { StepperNextModule } from 'projects/ngx-proximus/src/lib/stepper-next/stepper-next.module';
import { TranslateModule } from '@ngx-translate/core';
import { PopupConfirmationModule } from 'projects/ngx-proximus/src/lib/popup-confirmation/popup-confirmation.module';
import { NewAssetService } from 'src/app/services/new-asset.service';
import { NewLocationService } from 'src/app/services/new-location.service';
import { LocationWizardComponent } from '../../../manage-locations/location-wizard/location-wizard.component';
import { ManageThresholdTemplatesComponent } from '../../../manage-threshold-templates/smartmonitoring/manage-threshold-templates.component';
import { AddSensorComponent } from '../../../manage-threshold-templates/smartmonitoring/add-sensor/add-sensor.component';

@NgModule({
  declarations: [
    AssetWizardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AssetWizardRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatListModule,
    IconModule,
    FormKeyvalueModule,
    FormGeolocationModule,
    EditableImageModule,
    LocationExplorerModule,
    StepperNextModule,
    TranslateModule,
    ListThingsModule,
    ListThresholdTemplatesModule,
    MatDialogModule,
    PopupConfirmationModule
  ],
  providers: [
    NewAssetService,
    NewLocationService
  ],
  entryComponents: [
    LocationWizardComponent,
    ManageThresholdTemplatesComponent,
    AddSensorComponent
  ]
})
export class AssetWizardModule { }
