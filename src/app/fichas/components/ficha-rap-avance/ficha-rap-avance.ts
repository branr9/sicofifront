import { Component, computed, input } from '@angular/core';
import { EstadoRap, Ficha } from '../../models/ficha.model';

@Component({
  selector: 'app-ficha-rap-avance',
  standalone: true,
  imports: [],
  templateUrl: './ficha-rap-avance.html',
  styleUrl: './ficha-rap-avance.css',
})
export class FichaRapAvance {
  readonly ficha = input<Ficha | null>(null);

  readonly totalRaps = computed(() => this.ficha()?.raps.length ?? 0);

  readonly rapsAprobados = computed(() => {
    const raps = this.ficha()?.raps ?? [];
    return raps.filter((rap) => rap.estado === 'Aprobado' || rap.porcentaje >= 100).length;
  });

  readonly avanceGeneral = computed(() => {
    const raps = this.ficha()?.raps ?? [];
    if (raps.length === 0) {
      return 0;
    }
    const suma = raps.reduce((acc, rap) => acc + rap.porcentaje, 0);
    return Math.round(suma / raps.length);
  });

  getToneClass(estado: EstadoRap): string {
    switch (estado) {
      case 'Aprobado':
      case 'En ejecución':
        return 'tone-lime';
      case 'En progreso':
        return 'tone-amber';
      case 'Pendiente':
        return 'tone-sky';
    }
  }
}
