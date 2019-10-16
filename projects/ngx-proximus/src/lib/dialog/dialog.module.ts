import { MatDialogModule, MatButtonModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';

@NgModule({
  declarations: [DialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [DialogComponent],
  entryComponents: [DialogComponent]
})
export class DialogModule { }
