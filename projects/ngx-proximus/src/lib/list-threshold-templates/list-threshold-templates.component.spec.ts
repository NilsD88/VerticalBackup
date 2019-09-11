import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListThresholdTemplatesComponent } from './list-threshold-templates.component';

describe('ListThresholdTemplatesComponent', () => {
  let component: ListThresholdTemplatesComponent;
  let fixture: ComponentFixture<ListThresholdTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListThresholdTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListThresholdTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
