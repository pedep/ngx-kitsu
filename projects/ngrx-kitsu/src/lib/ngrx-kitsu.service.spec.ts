import { TestBed } from '@angular/core/testing';

import { NgrxKitsuService } from './ngrx-kitsu.service';

describe('NgrxKitsuService', () => {
  let service: NgrxKitsuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgrxKitsuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
