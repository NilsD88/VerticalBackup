import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListThingsComponent } from './list-things.component';

describe('ListThingsComponent', () => {
  let component: ListThingsComponent;
  let fixture: ComponentFixture<ListThingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListThingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListThingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
