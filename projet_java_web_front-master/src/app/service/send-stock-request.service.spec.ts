import { TestBed } from '@angular/core/testing';

import { SendStockRequestService } from './send-stock-request.service';

describe('SentStockRequestService', () => {
  let service: SendStockRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendStockRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
