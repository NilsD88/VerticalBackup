import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import {HomeRoutes} from './home.routing';
import {RouterModule} from '@angular/router';
import {IconModule} from '../../../../../projects/ngx-proximus/src/lib/icon/icon.module';
import {SlideshowModule} from '../../../../../projects/ngx-proximus/src/lib/slideshow/slideshow.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(HomeRoutes),
    IconModule,
    SlideshowModule,
    TranslateModule
  ]
})
export class HomeModule { }
