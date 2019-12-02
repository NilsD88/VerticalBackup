import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPointsOfAttentionComponent } from './list-points-of-attention.component';

describe('ListPointsOfAttentionComponent', () => {
  let component: ListPointsOfAttentionComponent;
  let fixture: ComponentFixture<ListPointsOfAttentionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPointsOfAttentionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPointsOfAttentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
