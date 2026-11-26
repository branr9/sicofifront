import { Component, input, output } from '@angular/core';
import { CeldaCoordenada } from '../../models/disponibilidad.model';

@Component({
  selector: 'app-horario-tabla',
  standalone: true,
  templateUrl: './horario-tabla.html',
  styleUrl: './horario-tabla.css',
})
export class HorarioTabla {
  readonly horas = input.required<readonly string[]>();
  readonly dias = input.required<readonly string[]>();
  readonly matriz = input.required<boolean[][]>();

  readonly celdaToggle = output<CeldaCoordenada>();
  readonly horaToggle = output<number>();
  readonly diaToggle = output<number>();
  readonly todasToggle = output<void>();

  formatearHoraCorta(hora: string): string {
    return hora.replace(':00', '');
  }
}
