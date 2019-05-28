import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductLinkComponent } from './product-link.component';

@NgModule({
  declarations: [ProductLinkComponent],
  imports: [
    CommonModule
  ],
  exports:[
    ProductLinkComponent
  ]
})
export class ProductLinkModule { }
