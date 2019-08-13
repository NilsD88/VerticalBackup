import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormKeyvalueComponent } from './form-keyvalue.component';

describe('FormKeyvalueComponent', () => {
  let component: FormKeyvalueComponent;
  let fixture: ComponentFixture<FormKeyvalueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormKeyvalueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormKeyvalueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
