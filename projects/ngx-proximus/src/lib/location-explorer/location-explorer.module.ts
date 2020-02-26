import { TranslateModule } from '@ngx-translate/core';
import { PopupConfirmationModule } from './../popup-confirmation/popup-confirmation.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationExplorerComponent } from './location-explorer.component';
import { MatTabsModule, MatListModule, MatIconModule, MatTooltipModule, MatButtonModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatDialogModule } from '@angular/material';
import { IconModule } from '../icon/icon.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MoveAssetsPopupComponent } from './move-assets-popup/move-assets-popup.component';

export const imports = [
  CommonModule,
    FormsModule,
    MatTabsModule,
    MatListModule,
    IconModule,
    DragDropModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    IconModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatAutocompleteModule,
    MatDialogModule,
    PopupConfirmationModule,
    TranslateModule
];

@NgModule({
  declarations: [
    LocationExplorerComponent,
    MoveAssetsPopupComponent,
  ],
  imports: [
    ...imports
  ],
  exports: [
    LocationExplorerComponent
  ],
  entryComponents: [
    MoveAssetsPopupComponent
  ]
})
export class LocationExplorerModule { }
