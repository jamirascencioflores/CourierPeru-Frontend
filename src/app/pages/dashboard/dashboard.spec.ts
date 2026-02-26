import { ComponentFixture, TestBed } from '@angular/core/testing';

// 👇 Importa el símbolo correcto DESDE el archivo correcto
import { DashboardComponent } from './dashboard';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Como es standalone, va en imports (no en declarations)
      imports: [DashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // dispara CD inicial
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
