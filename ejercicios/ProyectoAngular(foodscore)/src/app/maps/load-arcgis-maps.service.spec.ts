import { TestBed } from '@angular/core/testing';

import { LoadArcgisMapsService } from './load-arcgis-maps.service';

describe('LoadArcgisMapsService', () => {
  let service: LoadArcgisMapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadArcgisMapsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
