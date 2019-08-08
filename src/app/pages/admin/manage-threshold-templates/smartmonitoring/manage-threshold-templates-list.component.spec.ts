import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageThresholdTemplatesListComponent } from './manage-threshold-templates-list.component';

describe('ManageThresholdTemplatesListComponent', () => {
  let component: ManageThresholdTemplatesListComponent;
  let fixture: ComponentFixture<ManageThresholdTemplatesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageThresholdTemplatesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageThresholdTemplatesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
