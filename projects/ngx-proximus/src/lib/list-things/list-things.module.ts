import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListThingsComponent } from './list-things.component';
import { IconModule } from '../../public-api';
import { MatProgressSpinnerModule, MatCardModule, MatTooltipModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, MatSortModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { LoaderModule } from '../loader/loader.module';

@NgModule({
  declarations: [ListThingsComponent],
  imports: [
    CommonModule,
    IconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    FormsModule,
    ImgFallbackModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    LoaderModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
  ]
})
export class ListThingsModule { }
