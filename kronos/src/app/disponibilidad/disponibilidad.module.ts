import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Disponibilidad } from './disponibilidad';
import { DisponibilidadHeader } from './components/disponibilidad-header/disponibilidad-header';
import { HorarioTabla } from './components/horario-tabla/horario-tabla';
import { FichaInstructor } from './components/ficha-instructor/ficha-instructor';

/**
 * Módulo de funcionalidad para la gestión de disponibilidad de instructores.
 * Agrupa y reexporta los componentes y el punto de entrada de la vista.
 */
@NgModule({
  imports: [
    CommonModule,
    Disponibilidad,
    DisponibilidadHeader,
    HorarioTabla,
    FichaInstructor,
  ],
  exports: [
    Disponibilidad,
    DisponibilidadHeader,
    HorarioTabla,
    FichaInstructor,
  ],
})
export class DisponibilidadModule {}
