import { Component, effect, input, output, signal } from '@angular/core';
import {
  EstadoMensaje,
  FOTO_RESPALDO,
  FOTO_SIN_SELECCION,
  Instructor,
} from '../../models/disponibilidad.model';

@Component({
  selector: 'app-ficha-instructor',
  standalone: true,
  templateUrl: './ficha-instructor.html',
  styleUrl: './ficha-instructor.css',
})
export class FichaInstructor {
  readonly instructor = input<Instructor | null>(null);
  readonly totalHoras = input<number>(0);
  readonly mensaje = input<EstadoMensaje | null>(null);

  readonly restriccionNocturnaClick = output<void>();
  readonly guardarClick = output<void>();
  readonly enviarCorreoClick = output<void>();

  readonly fotoActual = signal<string>(FOTO_SIN_SELECCION);

  constructor() {
    effect(() => {
      const actual = this.instructor();
      this.fotoActual.set(actual ? actual.foto : FOTO_SIN_SELECCION);
    });
  }

  onFotoError(): void {
    if (this.fotoActual() !== FOTO_RESPALDO) {
      this.fotoActual.set(FOTO_RESPALDO);
    }
  }
}
