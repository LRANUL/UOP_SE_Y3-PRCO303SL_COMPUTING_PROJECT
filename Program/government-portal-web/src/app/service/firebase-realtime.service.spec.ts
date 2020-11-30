import { TestBed } from '@angular/core/testing';

import { FirebaseRealtimeService } from './firebase-realtime.service';

describe('FirebaseRealtimeService', () => {
  let service: FirebaseRealtimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseRealtimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
