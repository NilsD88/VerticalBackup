import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePointsOfAttentionComponent } from './manage-points-of-attention.component';

describe('ManagePointsOfAttentionComponent', () => {
  let component: ManagePointsOfAttentionComponent;
  let fixture: ComponentFixture<ManagePointsOfAttentionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePointsOfAttentionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePointsOfAttentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
