import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Following } from './following';

describe('Following', () => {
  let component: Following;
  let fixture: ComponentFixture<Following>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Following]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Following);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
