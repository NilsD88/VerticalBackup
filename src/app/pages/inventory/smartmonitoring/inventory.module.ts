import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgxMatDrpModule} from 'ngx-mat-daterange-picker';
import {NgSelectModule} from '@ng-select/ng-select';
import {HttpClientModule} from '@angular/common/http';
import {InventoryRoutes} from './inventory.routing';
import {InventoryComponent} from './inventory.component';
import {SharedService} from '../../../services/shared.service';
import {FilterService} from '../../../services/filter.service';
import {AssetService} from '../../../services/asset.service';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {LocationsService} from '../../../services/locations.service';
import {
  MatCardModule, MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatMenuModule,
  MatPaginatorModule,
  MatTooltipModule,
  MatButtonModule
} from '@angular/material';
import {LoaderModule} from '../../../../../projects/ngx-proximus/src/lib/loader/loader.module';
import { IconModule } from 'projects/ngx-proximus/src/public-api';
import { LocationExplorerOldModule } from 'projects/ngx-proximus/src/lib/location-explorer-old/location-explorer-old.module';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(InventoryRoutes),
    FormsModule,
    NgxMatDrpModule,
    TranslateModule,
    NgSelectModule,
    HttpClientModule,
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
    LocationExplorerOldModule,
  ],
  declarations: [InventoryComponent],
  providers: [AssetService, FilterService, LocationsService, SharedService]
})
export class InventoryModule {
}
