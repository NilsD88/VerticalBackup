import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountByAssetComponent } from './count-by-asset.component';

describe('CountByAssetComponent', () => {
  let component: CountByAssetComponent;
  let fixture: ComponentFixture<CountByAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountByAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountByAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
