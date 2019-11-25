import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCustomFieldsComponent } from './form-custom-fields.component';

describe('FormCustomFieldsComponent', () => {
  let component: FormCustomFieldsComponent;
  let fixture: ComponentFixture<FormCustomFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCustomFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCustomFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
