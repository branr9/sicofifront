import { Component, inject } from '@angular/core';
import { DisponibilidadHeader } from './components/disponibilidad-header/disponibilidad-header';
import { HorarioTabla } from './components/horario-tabla/horario-tabla';
import { FichaInstructor } from './components/ficha-instructor/ficha-instructor';
import { DisponibilidadService } from './services/disponibilidad.service';
import { CeldaCoordenada } from './models/disponibilidad.model';

@Component({
  selector: 'app-disponibilidad',
  standalone: true,
  imports: [DisponibilidadHeader, HorarioTabla, FichaInstructor],
  templateUrl: './disponibilidad.html',
  styleUrl: './disponibilidad.css',
})
export class Disponibilidad {
  protected readonly servicio = inject(DisponibilidadService);

  onSeleccionarInstructor(id: string): void {
    this.servicio.seleccionarInstructor(id);
  }

  onAlternarCelda(celda: CeldaCoordenada): void {
    this.servicio.alternarCelda(celda.fila, celda.columna);
  }

  onAlternarHora(fila: number): void {
    this.servicio.restringirHora(fila);
  }

  onAlternarDia(columna: number): void {
    this.servicio.seleccionarDia(columna);
  }

  onAlternarTodas(): void {
    this.servicio.seleccionarTodasLasHoras();
  }

  onAplicarRestriccionNocturna(): void {
    this.servicio.aplicarRestriccionNocturna();
  }

  onGuardarRestricciones(): void {
    this.servicio.guardarRestricciones();
  }

  onEnviarCorreo(): void {
    this.servicio.enviarInformacionInstructor();
  }
}
