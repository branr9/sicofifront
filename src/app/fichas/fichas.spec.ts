import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Fichas } from './fichas';

describe('Fichas', () => {
  let component: Fichas;
  let fixture: ComponentFixture<Fichas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fichas],
    }).compileComponents();

    fixture = TestBed.createComponent(Fichas);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create and render initial fichas table and RAP section', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
    expect(compiled.textContent).toContain('2395063');
    expect(compiled.textContent).toContain('Avances de Resultados de Aprendizaje (RAP)');
  });

  it('should filter fichas by search term', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const searchInput = compiled.querySelector<HTMLInputElement>('input[aria-label="Buscar fichas"]');
    expect(searchInput).toBeTruthy();

    searchInput!.value = 'Salesiano';
    searchInput!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const rows = compiled.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('2313782');
  });

  it('should create a new ficha when valid form data is submitted', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const setVal = (selector: string, value: string, eventName = 'input') => {
      const el = compiled.querySelector<HTMLInputElement | HTMLSelectElement>(selector)!;
      el.value = value;
      el.dispatchEvent(new Event(eventName));
    };

    setVal('#crearCodigo', '2999999');
    setVal('#crearNombre', 'Desarrollo Web Fullstack');
    setVal('#crearPrograma', '228118000');
    setVal('#crearVersion', 'V3');
    setVal('#crearFechaInicio', '2026-02-01');
    setVal('#crearFechaFin', '2026-12-15');
    setVal('#tipoDias', 'tecnico-tecnologo', 'change');
    fixture.detectChanges();

    const form = compiled.querySelector('form.ficha-grid')!;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    const rows = compiled.querySelectorAll('tbody tr');
    expect(rows.length).toBe(4);
    expect(compiled.textContent).toContain('2999999');
    expect(compiled.textContent).toContain('Desarrollo Web Fullstack');
  });

  it('should open edit modal, save changes, and record history', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const editBtn = compiled.querySelector<HTMLButtonElement>('button[aria-label="Editar ficha 2395063"]');
    expect(editBtn).toBeTruthy();

    editBtn!.click();
    fixture.detectChanges();

    const sedeSelect = compiled.querySelector<HTMLSelectElement>('#selectSede')!;
    sedeSelect.value = 'Bicentenario';
    sedeSelect.dispatchEvent(new Event('change'));

    const modalForm = compiled.querySelector('app-ficha-edit-modal form')!;
    modalForm.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    const firstRow = compiled.querySelector('tbody tr')!;
    expect(firstRow.textContent).toContain('Bicentenario');

    const historialBtn = compiled.querySelector<HTMLButtonElement>('.btn-historial')!;
    historialBtn.click();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Actualización de ficha');
  });

  it('should delete a ficha after confirmation', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const deleteBtn = compiled.querySelector<HTMLButtonElement>('button[aria-label="Eliminar ficha 2401923"]');
    deleteBtn!.click();
    fixture.detectChanges();

    const confirmBtn = compiled.querySelector<HTMLButtonElement>('.btn-confirm-del')!;
    expect(confirmBtn).toBeTruthy();
    confirmBtn.click();
    fixture.detectChanges();

    const rows = compiled.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(compiled.querySelector('tbody')?.textContent).not.toContain('2401923');
    expect(compiled.querySelector('.toast-banner')?.textContent).toContain(
      'Ficha #2401923 eliminada del listado.'
    );
  });

  it('should support custom weekdays and reject duplicate ficha codes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const setVal = (selector: string, value: string, eventName = 'input') => {
      const el = compiled.querySelector<HTMLInputElement | HTMLSelectElement>(selector)!;
      el.value = value;
      el.dispatchEvent(new Event(eventName));
    };

    setVal('#crearCodigo', '2395063');
    setVal('#crearNombre', 'Duplicada');
    setVal('#crearPrograma', '228106000');
    setVal('#crearVersion', 'V1');
    setVal('#crearFechaInicio', '2026-03-01');
    setVal('#crearFechaFin', '2026-11-30');
    setVal('#tipoDias', 'otro', 'change');
    fixture.detectChanges();

    const sabadoCheckbox = Array.from(
      compiled.querySelectorAll<HTMLInputElement>('.dia-check-item input[type="checkbox"]')
    ).find((cb) => cb.parentElement?.textContent?.includes('Sábado'));
    expect(sabadoCheckbox).toBeTruthy();
    sabadoCheckbox!.checked = true;
    sabadoCheckbox!.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const form = compiled.querySelector('form.ficha-grid')!;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(3);
    expect(compiled.querySelector('.toast-banner')?.textContent).toContain(
      'Ya existe una ficha con el código 2395063.'
    );
  });
});
