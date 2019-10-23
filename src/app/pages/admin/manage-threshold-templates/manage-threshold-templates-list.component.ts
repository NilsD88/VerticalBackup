import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'pvf-manage-threshold-templates-list',
  templateUrl: './manage-threshold-templates-list.component.html',
  styleUrls: ['./manage-threshold-templates-list.component.scss']
})
export class ManageThresholdTemplatesListComponent implements OnInit {

  async ngOnInit() {
    console.log('ngOnInit ManageThresholdTemplatesListComponent');
  }

}
