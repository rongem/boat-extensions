import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmoketestComponent } from './smoketest.component';

describe('SmoketestComponent', () => {
  let component: SmoketestComponent;
  let fixture: ComponentFixture<SmoketestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmoketestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmoketestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
