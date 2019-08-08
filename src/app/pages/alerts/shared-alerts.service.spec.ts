import { TestBed } from '@angular/core/testing';

import { SharedAlertsService } from './shared-alerts.service';

describe('SharedAlertsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedAlertsService = TestBed.get(SharedAlertsService);
    expect(service).toBeTruthy();
  });
});
