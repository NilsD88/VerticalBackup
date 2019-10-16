import { EditSensorPopupComponent } from './edit-sensor-popup/edit-sensor-popup.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListThingsComponent } from './list-things.component';
import { IconModule } from '../../public-api';
import { MatProgressSpinnerModule, MatCardModule, MatTooltipModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, MatSortModule, MatCheckboxModule, MatSnackBarModule, MatDialogModule, MatSelectModule, MatPaginatorModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { LoaderModule } from '../loader/loader.module';
import { NewThingService } from 'src/app/services/new-thing.service';

@NgModule({
  declarations: [ListThingsComponent, EditSensorPopupComponent],
  imports: [
    CommonModule,
    FormsModule,
    IconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    ImgFallbackModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    LoaderModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatPaginatorModule,
  ],
  providers: [
    NewThingService
  ],
  exports: [
    ListThingsComponent
  ],
  entryComponents: [
    EditSensorPopupComponent
  ]
})
export class ListThingsModule { }