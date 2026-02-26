import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisDirecciones } from './mis-direcciones';

describe('MisDirecciones', () => {
  let component: MisDirecciones;
  let fixture: ComponentFixture<MisDirecciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisDirecciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisDirecciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
