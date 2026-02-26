import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Como es standalone, va en imports
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // dispara detección de cambios
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
