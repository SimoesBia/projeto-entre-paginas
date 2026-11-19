import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MinhaEstantePage } from './minha-estante.page';

describe('MinhaEstantePage', () => {
  let component: MinhaEstantePage;
  let fixture: ComponentFixture<MinhaEstantePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MinhaEstantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
