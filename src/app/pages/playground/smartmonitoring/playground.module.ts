import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaygroundComponent } from './playground.component';
import {RouterModule} from '@angular/router';
import {PlaygroundRoutes} from './playground.routing';
import {MatStepperModule, MatInputModule, MatButtonModule, MatSelectModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {IconModule} from '../../../../../projects/ngx-proximus/src/lib/icon/icon.module';
import { FormKeyvalueModule } from '../../../../../projects/ngx-proximus/src/lib/form-keyvalue/form-keyvalue.module';
import { FormGeolocationModule } from '../../../../../projects/ngx-proximus/src/lib/form-geolocation/form-geolocation.module';
import { EditableImageModule } from '../../../../../projects/ngx-proximus/src/lib/editable-image/editable-image.module';
import { LocationExplorerModule } from '../../../../../projects/ngx-proximus/src/lib/location-explorer/location-explorer.module';
import { MapAssetModule } from 'projects/ngx-proximus/src/lib/map-asset/map-asset.module';
@NgModule({
  declarations: [
    PlaygroundComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PlaygroundRoutes),
    MapAssetModule
  ]
})
export class PlaygroundModule { }
