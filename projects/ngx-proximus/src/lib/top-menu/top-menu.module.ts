import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopMenuComponent } from './top-menu.component';
import {IconModule} from '../icon/icon.module';
import {MatMenuModule} from '@angular/material';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [TopMenuComponent],
  imports: [
    CommonModule,
    IconModule,
    MatMenuModule,
    FormsModule,
  ],
  exports: [
    TopMenuComponent
  ]
})
export class TopMenuModule { }
