import { TestBed } from '@angular/core/testing';

import { NgxKitsuService } from './ngx-kitsu.service';

describe('NgxKitsuService', () => {
  let service: NgxKitsuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxKitsuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
