import { PopupConfirmationModule } from 'projects/ngx-proximus/src/lib/popup-confirmation/popup-confirmation.module';
import { EasterEggModule } from 'projects/ngx-proximus/src/lib/easter-egg/easter-egg.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ManageAssetsRoutes} from './manage-assets.routing';
import {FormsModule} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule, MatChipsModule, MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatSelectModule, MatTooltipModule, MatSortModule, MatTableModule, MatProgressSpinnerModule, MatCardModule, MatMenuModule
} from '@angular/material';
import {LoaderModule} from 'projects/ngx-proximus/src/lib/loader/loader.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {EditableImageModule} from 'projects/ngx-proximus/src/lib/editable-image/editable-image.module';
import {ManageAssetsListComponent} from './manage-assets-list.component';
import {IconModule} from 'projects/ngx-proximus/src/lib/icon/icon.module';
import {BadgeModule} from 'projects/ngx-proximus/src/lib/badge/badge.module';
import {ThingsListModule} from 'projects/ngx-proximus/src/lib/things-list/things-list.module';
import { TranslateModule } from '@ngx-translate/core';
import { AssetService } from 'src/app/services/asset.service';

@NgModule({
  declarations: [ManageAssetsListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ManageAssetsRoutes),
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatMenuModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatCardModule,
    LoaderModule,
    FlexLayoutModule,
    EditableImageModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule,
    BadgeModule,
    ThingsListModule,
    IconModule,
    EasterEggModule,
    TranslateModule,
    MatPaginatorModule,
    PopupConfirmationModule,
  ],
  providers: [
    AssetService
  ]
})
export class ManageAssetsModule {
}
