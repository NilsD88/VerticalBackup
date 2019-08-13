import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoaderComponent} from './loader.component';

@NgModule({
  declarations: [LoaderComponent],
  imports: [
    CommonModule
  ],
  exports: [LoaderComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class LoaderModule {
}
