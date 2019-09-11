import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LocationExplorerModule } from 'projects/ngx-proximus/src/lib/location-explorer/location-explorer.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageLocationsComponent } from './manage-locations.component';
import {RouterModule} from '@angular/router';
import {ManageLocationsRoutes} from './manage-locations.routing';
import { MatButtonModule, MatTooltipModule, MatTreeModule, MatIconModule, MatInputModule, MatAutocompleteModule } from '@angular/material';
import { IconModule } from 'projects/ngx-proximus/src/public-api';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ManageLocationsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ManageLocationsRoutes),
    MatButtonModule,
    MatTooltipModule,
    IconModule,
    TranslateModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    LocationExplorerModule,
  ]
})
export class ManageLocationsModule { }
