import { TestBed } from '@angular/core/testing';

import { LogsServiceService } from './logs-service.service';

describe('LogsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LogsServiceService = TestBed.get(LogsServiceService);
    expect(service).toBeTruthy();
  });
});
