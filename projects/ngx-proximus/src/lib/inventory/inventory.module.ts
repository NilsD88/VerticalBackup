import { AssetTileModule } from './../asset-tile/asset-tile.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgxMatDrpModule} from 'ngx-mat-daterange-picker';
import {NgSelectModule} from '@ng-select/ng-select';
import {InventoryRoutes} from './inventory.routing';
import {InventoryComponent} from './inventory.component';
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
import {LoaderModule} from 'projects/ngx-proximus/src/lib/loader/loader.module';
import { IconModule } from 'projects/ngx-proximus/src/public-api';
import { MapModule } from 'projects/ngx-proximus/src/lib/map/map.module';
import { AssetExplorerModule } from '../asset-explorer/asset-explorer.module';

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
    AssetExplorerModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MapModule,
    AssetTileModule,
  ],
  declarations: [InventoryComponent],
  exports: [InventoryComponent]
})
export class InventoryModule {
}
