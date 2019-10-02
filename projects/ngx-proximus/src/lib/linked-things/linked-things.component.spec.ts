import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedThingsComponent } from './linked-things.component';

describe('LinkedThingsComponent', () => {
  let component: LinkedThingsComponent;
  let fixture: ComponentFixture<LinkedThingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkedThingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedThingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
