import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalCountPastYearComponent } from './total-count-past-year.component';

describe('TotalCountPastYearComponent', () => {
  let component: TotalCountPastYearComponent;
  let fixture: ComponentFixture<TotalCountPastYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalCountPastYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalCountPastYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
