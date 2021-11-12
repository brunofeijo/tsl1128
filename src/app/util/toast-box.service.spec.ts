import { TestBed } from '@angular/core/testing';

import { ToastBoxService } from './toast-box.service';

describe('ToastBoxService', () => {
  let service: ToastBoxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastBoxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
