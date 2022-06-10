import { TestBed } from '@angular/core/testing';

import { ActionCenterService } from './action-center.service';

describe('ActionCenterService', () => {
  let service: ActionCenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionCenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
