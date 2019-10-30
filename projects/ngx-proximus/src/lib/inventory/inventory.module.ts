import { NewLocationService } from 'src/app/services/new-location.service';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgxMatDrpModule} from 'ngx-mat-daterange-picker';
import {NgSelectModule} from '@ng-select/ng-select';
import {InventoryRoutes} from './inventory.routing';
import {InventoryComponent} from './inventory.component';
import {SharedService} from 'src/app/services/shared.service';
import {FilterService} from 'src/app/services/filter.service';
import {AssetService} from 'src/app/services/asset.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {LocationsService} from 'src/app/services/locations.service';
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
import {LoaderModule} from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { IconModule } from 'projects/ngx-proximus/src/public-api';
import { LocationExplorerModule } from 'projects/ngx-proximus/src/lib/location-explorer/location-explorer.module';
import { MapModule } from 'projects/ngx-proximus/src/lib/map/map.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(InventoryRoutes),
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
    MapModule
  ],
  declarations: [InventoryComponent],
  providers: [AssetService, FilterService, LocationsService, SharedService, NewLocationService],
  exports: [InventoryComponent]
})
export class InventoryModule {
}
