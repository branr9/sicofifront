import { Component, input, output } from '@angular/core';
import { Instructor } from '../../models/disponibilidad.model';

@Component({
  selector: 'app-disponibilidad-header',
  standalone: true,
  templateUrl: './disponibilidad-header.html',
  styleUrl: './disponibilidad-header.css',
})
export class DisponibilidadHeader {
  readonly instructores = input.required<readonly Instructor[]>();
  readonly instructorSeleccionadoId = input<string>('');
  readonly instructorChange = output<string>();

  onSeleccionar(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.instructorChange.emit(select.value);
  }
}
