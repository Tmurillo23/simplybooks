import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewDetail } from './review-detail';

describe('ReviewDetail', () => {
  let component: ReviewDetail;
  let fixture: ComponentFixture<ReviewDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
