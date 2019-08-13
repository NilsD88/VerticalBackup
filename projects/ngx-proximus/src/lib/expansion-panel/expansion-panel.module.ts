import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ExpansionPanelComponent} from './expansion-panel.component';
import {ExpansionPanelHeaderComponent} from './expansion-panel-header/expansion-panel-header.component';
import {ExpansionPanelContentComponent} from './expansion-panel-content/expansion-panel-content.component';
import {IconModule} from '../icon/icon.module';

@NgModule({
  declarations: [ExpansionPanelComponent, ExpansionPanelHeaderComponent, ExpansionPanelContentComponent],
  imports: [
    CommonModule,
    IconModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [
    ExpansionPanelComponent, ExpansionPanelHeaderComponent, ExpansionPanelContentComponent
  ]
})
export class ExpansionPanelModule {
}
