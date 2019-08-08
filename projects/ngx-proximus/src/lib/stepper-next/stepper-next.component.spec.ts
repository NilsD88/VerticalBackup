import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperNextComponent } from './stepper-next.component';

describe('StepperNextComponent', () => {
  let component: StepperNextComponent;
  let fixture: ComponentFixture<StepperNextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepperNextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperNextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
