import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClubePage } from './clube.page';

describe('ClubePage', () => {
  let component: ClubePage;
  let fixture: ComponentFixture<ClubePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
