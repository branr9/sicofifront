import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Ficha,
  FichaEditPayload,
  INSTRUCTORES_DISPONIBLES,
  InstructorLider,
  SEDES_DISPONIBLES,
  Sede,
} from '../../models/ficha.model';
import { formatDisplayToIsoDate } from '../../services/fichas.service';

@Component({
  selector: 'app-ficha-edit-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './ficha-edit-modal.html',
  styleUrl: './ficha-edit-modal.css',
})
export class FichaEditModal {
  private readonly fb = inject(FormBuilder);

  readonly ficha = input<Ficha | null>(null);
  readonly close = output<void>();
  readonly save = output<FichaEditPayload>();

  readonly sedes = SEDES_DISPONIBLES;
  readonly instructores = INSTRUCTORES_DISPONIBLES;

  readonly editForm = this.fb.nonNullable.group({
    fechaTerminoIso: ['', [Validators.required]],
    sede: ['Sagrado' as Sede, [Validators.required]],
    instructorLider: ['Pinillos' as InstructorLider, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.ficha();
      if (current) {
        this.editForm.reset({
          fechaTerminoIso: formatDisplayToIsoDate(current.fechaTermino),
          sede: current.sede,
          instructorLider: current.instructorLider,
        });
      }
    });
  }

  onSave(): void {
    const current = this.ficha();
    if (!current || this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const raw = this.editForm.getRawValue();
    this.save.emit({
      codigo: current.codigo,
      fechaTerminoIso: raw.fechaTerminoIso,
      sede: raw.sede,
      instructorLider: raw.instructorLider,
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
