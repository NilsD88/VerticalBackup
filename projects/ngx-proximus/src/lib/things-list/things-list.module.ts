import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThingsListComponent} from './things-list.component';

@NgModule({
  declarations: [ThingsListComponent],
  imports: [
    CommonModule
  ],
  exports: [
    ThingsListComponent
  ]
})
export class ThingsListModule {
}
