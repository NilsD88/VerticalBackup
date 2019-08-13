import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopMenuComponent } from './top-menu.component';
import {IconModule} from '../icon/icon.module';
import {MatMenuModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [TopMenuComponent],
  imports: [
    CommonModule,
    IconModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  exports: [
    TopMenuComponent
  ]
})
export class TopMenuModule { }
