import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveAssetsPopupComponent } from './move-assets-popup.component';

describe('MoveAssetsPopupComponent', () => {
  let component: MoveAssetsPopupComponent;
  let fixture: ComponentFixture<MoveAssetsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveAssetsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveAssetsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
