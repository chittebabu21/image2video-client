import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneratePage } from './generate.page';

describe('GeneratePage', () => {
  let component: GeneratePage;
  let fixture: ComponentFixture<GeneratePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
