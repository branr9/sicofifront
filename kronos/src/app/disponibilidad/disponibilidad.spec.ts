import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Disponibilidad } from './disponibilidad';
import { DisponibilidadService } from './services/disponibilidad.service';

describe('Disponibilidad', () => {
  let component: Disponibilidad;
  let fixture: ComponentFixture<Disponibilidad>;
  let service: DisponibilidadService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Disponibilidad],
    }).compileComponents();

    fixture = TestBed.createComponent(Disponibilidad);
    component = fixture.componentInstance;
    service = TestBed.inject(DisponibilidadService);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create with initial night restriction applied (54 horas)', () => {
    expect(component).toBeTruthy();
    expect(service.totalHorasRestringidas()).toBe(54);
    const totalEl = fixture.nativeElement.querySelector('#totalHoras') as HTMLElement;
    expect(totalEl.textContent?.trim()).toBe('54 horas');
  });

  it('should update instructor details when selecting an instructor', () => {
    const select = fixture.nativeElement.querySelector(
      '#selectorInstructor',
    ) as HTMLSelectElement;
    select.value = '1';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(service.instructorSeleccionado()?.nombre).toBe('Carlos Mendoza');
    expect(fixture.nativeElement.textContent).toContain('cmendoza@sena.edu.co');
    expect(fixture.nativeElement.textContent).toContain('3237741');
  });

  it('should toggle individual cell, row, column, and all cells', () => {
    // Apagar restricción nocturna inicial -> 0 horas
    component.onAplicarRestriccionNocturna();
    expect(service.totalHorasRestringidas()).toBe(0);

    // Celda individual
    component.onAlternarCelda({ fila: 8, columna: 2 });
    expect(service.totalHorasRestringidas()).toBe(1);

    // Hora completa (fila 10 -> 6 días)
    component.onAlternarHora(10);
    expect(service.totalHorasRestringidas()).toBe(7);

    // Día completo (columna 0 -> 24 filas; 10 ya estaba marcada)
    component.onAlternarDia(0);
    expect(service.totalHorasRestringidas()).toBe(30);

    // Todas las horas -> marca las 144 celdas y luego limpia todas
    component.onAlternarTodas();
    expect(service.totalHorasRestringidas()).toBe(144);
    component.onAlternarTodas();
    expect(service.totalHorasRestringidas()).toBe(0);
  });

  it('should validate instructor and hours before saving or sending email', () => {
    component.onGuardarRestricciones();
    expect(service.mensaje()?.esError).toBe(true);
    expect(service.mensaje()?.texto).toBe(
      'Primero debes seleccionar un instructor.',
    );

    component.onSeleccionarInstructor('2');
    expect(service.mensaje()).toBeNull();

    component.onGuardarRestricciones();
    expect(service.mensaje()?.esError).toBe(false);
    expect(service.mensaje()?.texto).toBe(
      'Las restricciones fueron guardadas correctamente.',
    );

    const url = service.enviarInformacionInstructor();
    expect(url).toContain('mailto:mrodriguez@sena.edu.co');
    expect(service.mensaje()?.esError).toBe(false);
    expect(service.mensaje()?.texto).toBe(
      'Se preparó el correo con la información del instructor.',
    );
  });
});
