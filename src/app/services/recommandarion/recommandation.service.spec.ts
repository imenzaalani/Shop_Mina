import { TestBed } from '@angular/core/testing';

import { RecommendationService } from './recommandation.service';

describe('RecommandationService', () => {
  let service: RecommendationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecommendationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
