import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainMenuComponent } from './main-menu.component';
import {LogoModule} from '../logo/logo.module';

@NgModule({
  declarations: [MainMenuComponent],
  imports: [
    CommonModule,
    LogoModule
  ],
  exports: [MainMenuComponent]
})
export class MainMenuModule { }
