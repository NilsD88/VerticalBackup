import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPointOfAttentionItemsComponent } from './list-point-of-attention-items.component';

describe('ListPointOfAttentionItemsComponent', () => {
  let component: ListPointOfAttentionItemsComponent;
  let fixture: ComponentFixture<ListPointOfAttentionItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPointOfAttentionItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPointOfAttentionItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
