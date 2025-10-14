import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialPost } from './social-post';

describe('SocialPost', () => {
  let component: SocialPost;
  let fixture: ComponentFixture<SocialPost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialPost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialPost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
