import { LocationTileModule } from './../location-tile/location-tile.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgxMatDrpModule} from 'ngx-mat-daterange-picker';
import {NgSelectModule} from '@ng-select/ng-select';
import {InventoryLocationsRoutes} from './inventory-locations.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {
  MatCardModule, MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatMenuModule,
  MatPaginatorModule,
  MatTooltipModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatAutocompleteModule
} from '@angular/material';
import {LoaderModule} from '../loader/loader.module';
import { IconModule } from '../icon/icon.module';
import { LocationExplorerModule } from '../location-explorer/location-explorer.module';
import { MapModule } from '../map/map.module';
import { InventoryLocationsComponent } from './inventory-locations.component';

@NgModule({
  declarations: [
    InventoryLocationsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(InventoryLocationsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxMatDrpModule,
    TranslateModule,
    NgSelectModule,
    MatCardModule,
    MatTooltipModule,
    LoaderModule,
    MatMenuModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    IconModule,
    LocationExplorerModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MapModule,
    LocationTileModule
  ],
  exports: [
    InventoryLocationsComponent
  ]
})
export class InventoryLocationsModule {
}
