import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionOrdenes } from './gestion-ordenes';

describe('GestionOrdenes', () => {
  let component: GestionOrdenes;
  let fixture: ComponentFixture<GestionOrdenes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionOrdenes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionOrdenes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
