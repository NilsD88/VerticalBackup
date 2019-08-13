import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetWizardComponent } from './asset-wizard.component';
import {RouterModule} from '@angular/router';
import {AssetWizardRoutes} from './asset-wizard.routing';
import {MatStepperModule, MatInputModule, MatButtonModule, MatSelectModule, MatListModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {IconModule} from '../../../../../../../projects/ngx-proximus/src/lib/icon/icon.module';
import { FormKeyvalueModule } from '../../../../../../../projects/ngx-proximus/src/lib/form-keyvalue/form-keyvalue.module';
import { FormGeolocationModule } from '../../../../../../../projects/ngx-proximus/src/lib/form-geolocation/form-geolocation.module';
import { EditableImageModule } from '../../../../../../../projects/ngx-proximus/src/lib/editable-image/editable-image.module';
import { LocationExplorerModule } from 'projects/ngx-proximus/src/lib/location-explorer/location-explorer.module';
import { ThingService } from 'src/app/services/thing.service';
import { StepperNextModule } from 'projects/ngx-proximus/src/lib/stepper-next/stepper-next.module';

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
  ],
  providers: [ThingService]
})
export class AssetWizardModule { }
