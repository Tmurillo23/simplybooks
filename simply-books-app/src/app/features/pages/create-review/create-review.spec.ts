import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReview } from './create-review';

describe('CreateReview', () => {
  let component: CreateReview;
  let fixture: ComponentFixture<CreateReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateReview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateReview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
