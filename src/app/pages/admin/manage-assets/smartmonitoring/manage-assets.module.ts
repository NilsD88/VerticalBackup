import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ManageAssetsComponent} from './manage-assets.component';
import {RouterModule} from '@angular/router';
import {ManageAssetsRoutes} from './manage-assets.routing';
import {FormsModule} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule, MatChipsModule, MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatSelectModule, MatTooltipModule, MatSortModule, MatTableModule, MatProgressSpinnerModule, MatCardModule
} from '@angular/material';
import {LoaderModule} from '../../../../../../projects/ngx-proximus/src/lib/loader/loader.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ImageEditorModule} from '../../../../../../projects/ngx-proximus/src/lib/image-editor/image-editor.module';
import {EditableImageModule} from '../../../../../../projects/ngx-proximus/src/lib/editable-image/editable-image.module';
import {ManageAssetsListComponent} from './manage-assets-list.component';
import {IconModule} from '../../../../../../projects/ngx-proximus/src/lib/icon/icon.module';
import {BadgeModule} from '../../../../../../projects/ngx-proximus/src/lib/badge/badge.module';
import {ThingsListModule} from '../../../../../../projects/ngx-proximus/src/lib/things-list/things-list.module';
import { TranslateModule } from '@ngx-translate/core';
import { NewAssetService } from 'src/app/services/new-asset.service';

@NgModule({
  declarations: [ManageAssetsComponent, ManageAssetsListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ManageAssetsRoutes),
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatCardModule,
    LoaderModule,
    FlexLayoutModule,
    ImageEditorModule,
    MatButtonModule,
    EditableImageModule,
    MatPaginatorModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule,
    BadgeModule,
    ThingsListModule,
    IconModule,
    TranslateModule
  ],
  providers: [
    NewAssetService
  ]
})
export class ManageAssetsModule {
}
