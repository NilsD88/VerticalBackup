import { InventoryLocationsModule } from './../../../../../../projects/ngx-proximus/src/lib/inventory-locations/inventory-locations.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { SmartCountingInventoryLocationsRoutes } from './inventory-locations.routing';
import { SmartCountingInventoryLocationsComponent } from './inventory-locations.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatDrpModule } from 'ngx-mat-daterange-picker';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatCardModule, MatTooltipModule, MatMenuModule, MatIconModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatButtonToggleModule, MatAutocompleteModule } from '@angular/material';
import { LoaderModule } from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { IconModule } from 'projects/ngx-proximus/src/public-api';
import { LocationExplorerModule } from 'projects/ngx-proximus/src/lib/location-explorer/location-explorer.module';
import { MapModule } from 'projects/ngx-proximus/src/lib/map/map.module';
import { LocationTileModule } from 'projects/ngx-proximus/src/lib/location-tile/location-tile.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SmartCountingInventoryLocationsRoutes),
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
  declarations: [SmartCountingInventoryLocationsComponent],
  exports: [SmartCountingInventoryLocationsComponent]
})
export class SmartCountingInventoryLocationsModule {
}
