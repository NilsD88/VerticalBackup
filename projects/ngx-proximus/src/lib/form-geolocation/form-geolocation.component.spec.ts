import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGeolocationComponent } from './form-geolocation.component';

describe('FormGeolocationComponent', () => {
  let component: FormGeolocationComponent;
  let fixture: ComponentFixture<FormGeolocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormGeolocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGeolocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
