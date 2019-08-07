import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaygroundComponent } from './playground.component';
import {RouterModule} from '@angular/router';
import {PlaygroundRoutes} from './playground.routing';
import {MatStepperModule, MatInputModule, MatButtonModule, MatSelectModule, MatListModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {IconModule} from '../../../../../projects/ngx-proximus/src/lib/icon/icon.module';
import { FormKeyvalueModule } from '../../../../../projects/ngx-proximus/src/lib/form-keyvalue/form-keyvalue.module';
import { FormGeolocationModule } from '../../../../../projects/ngx-proximus/src/lib/form-geolocation/form-geolocation.module';
import { EditableImageModule } from '../../../../../projects/ngx-proximus/src/lib/editable-image/editable-image.module';
import { LocationExplorerModule } from 'projects/ngx-proximus/src/lib/location-explorer/location-explorer.module';
import { ThingService } from 'src/app/services/thing.service';
import { ButtonModule } from 'projects/ngx-proximus/src/public-api';
import { StepperNextModule } from 'projects/ngx-proximus/src/lib/stepper-next/stepper-next.module';
@NgModule({
  declarations: [
    PlaygroundComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PlaygroundRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatListModule,
    IconModule,
    ButtonModule,
    FormKeyvalueModule,
    FormGeolocationModule,
    EditableImageModule,
    LocationExplorerModule,
    StepperNextModule,
  ],
  providers: [ThingService]
})
export class PlaygroundModule { }
