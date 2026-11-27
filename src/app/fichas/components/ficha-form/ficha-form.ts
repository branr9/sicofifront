import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DIAS_SEMANA,
  DIAS_TECNICO_TECNOLOGO,
  DiaSemana,
  FichaCreatePayload,
  INSTRUCTORES_DISPONIBLES,
  InstructorLider,
  JORNADAS_DISPONIBLES,
  Jornada,
  NIVELES_DISPONIBLES,
  NivelFormacion,
  SEDES_DISPONIBLES,
  Sede,
  TipoProgramacionDias,
} from '../../models/ficha.model';

@Component({
  selector: 'app-ficha-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './ficha-form.html',
  styleUrl: './ficha-form.css',
})
export class FichaForm {
  private readonly fb = inject(FormBuilder);

  readonly resetTick = input<number>(0);
  readonly submitFicha = output<FichaCreatePayload>();

  readonly niveles = NIVELES_DISPONIBLES;
  readonly jornadas = JORNADAS_DISPONIBLES;
  readonly sedes = SEDES_DISPONIBLES;
  readonly instructores = INSTRUCTORES_DISPONIBLES;
  readonly diasSemana = DIAS_SEMANA;
  readonly diasAutomaticos = DIAS_TECNICO_TECNOLOGO;

  readonly selectedCustomDays = signal<DiaSemana[]>([]);
  readonly formError = signal<string | null>(null);
  readonly submitted = signal<boolean>(false);

  readonly fichaForm = this.fb.nonNullable.group({
    codigo: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    codPrograma: ['', [Validators.required]],
    nivelFormacion: ['Técnico' as NivelFormacion, [Validators.required]],
    jornada: ['Mañana' as Jornada, [Validators.required]],
    sede: ['Sagrado' as Sede, [Validators.required]],
    version: ['', [Validators.required]],
    instructorLider: ['Pinillos' as InstructorLider, [Validators.required]],
    fechaInicio: ['', [Validators.required]],
    fechaFin: ['', [Validators.required]],
    tipoDias: ['' as TipoProgramacionDias, [Validators.required]],
  });

  constructor() {
    effect(() => {
      if (this.resetTick() > 0) {
        this.resetForm();
      }
    });
  }

  get tipoDiasActual(): TipoProgramacionDias {
    return this.fichaForm.controls.tipoDias.value;
  }

  onTipoDiasChange(): void {
    this.selectedCustomDays.set([]);
    this.formError.set(null);
  }

  isDiaSelected(dia: DiaSemana): boolean {
    return this.selectedCustomDays().includes(dia);
  }

  toggleDia(dia: DiaSemana, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedCustomDays.update((days) => {
      if (checked) {
        return days.includes(dia) ? days : [...days, dia];
      }
      return days.filter((item) => item !== dia);
    });
    this.formError.set(null);
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.formError.set(null);

    if (this.fichaForm.invalid) {
      this.fichaForm.markAllAsTouched();
      this.formError.set('Por favor complete todos los campos requeridos del formulario.');
      return;
    }

    const raw = this.fichaForm.getRawValue();
    const diasLista: DiaSemana[] =
      raw.tipoDias === 'tecnico-tecnologo'
        ? [...DIAS_TECNICO_TECNOLOGO]
        : DIAS_SEMANA.filter((dia) => this.selectedCustomDays().includes(dia));

    if (diasLista.length === 0) {
      this.formError.set('Seleccione al menos un día de la semana.');
      return;
    }

    if (raw.fechaInicio && raw.fechaFin && raw.fechaFin < raw.fechaInicio) {
      this.formError.set('La fecha de finalización no puede ser anterior a la fecha de inicio.');
      return;
    }

    this.submitFicha.emit({
      codigo: raw.codigo,
      nombre: raw.nombre,
      codPrograma: raw.codPrograma,
      nivelFormacion: raw.nivelFormacion,
      jornada: raw.jornada,
      sede: raw.sede,
      version: raw.version,
      instructorLider: raw.instructorLider,
      fechaInicio: raw.fechaInicio,
      fechaTermino: raw.fechaFin,
      diasLista,
    });
  }

  resetForm(): void {
    this.fichaForm.reset({
      codigo: '',
      nombre: '',
      codPrograma: '',
      nivelFormacion: 'Técnico',
      jornada: 'Mañana',
      sede: 'Sagrado',
      version: '',
      instructorLider: 'Pinillos',
      fechaInicio: '',
      fechaFin: '',
      tipoDias: '',
    });
    this.selectedCustomDays.set([]);
    this.submitted.set(false);
    this.formError.set(null);
  }
}
