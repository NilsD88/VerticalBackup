import { MatButtonModule, MatDialogModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupConfirmationComponent } from './popup-confirmation.component';

@NgModule({
  declarations: [PopupConfirmationComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ],
  exports: [PopupConfirmationComponent],
  entryComponents: [PopupConfirmationComponent]
})
export class PopupConfirmationModule { }
