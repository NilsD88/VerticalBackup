import { IconModule } from './../icon/icon.module';
import { LogoModule } from './../logo/logo.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EasterEggComponent } from './easter-egg.component';

@NgModule({
  declarations: [EasterEggComponent],
  imports: [
    CommonModule,
    LogoModule,
    IconModule
  ],
  exports: [
    EasterEggComponent
  ]
})
export class EasterEggModule { }
