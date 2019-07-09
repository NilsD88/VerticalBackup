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
  MatProgressSpinnerModule,
  MatTooltipModule
} from '@angular/material';


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
    MatMenuModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule

  ],
  declarations: [InventoryComponent],
  providers: [AssetService, FilterService, LocationsService, SharedService]
})
export class InventoryModule {
}
