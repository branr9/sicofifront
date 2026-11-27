import { Component, input, output } from '@angular/core';
import { Ficha } from '../../models/ficha.model';

@Component({
  selector: 'app-fichas-tabla',
  standalone: true,
  imports: [],
  templateUrl: './fichas-tabla.html',
  styleUrl: './fichas-tabla.css',
})
export class FichasTabla {
  readonly fichas = input.required<Ficha[]>();
  readonly searchTerm = input<string>('');
  readonly selectedCodigo = input<string | null>(null);

  readonly searchChange = output<string>();
  readonly openHistorial = output<void>();
  readonly selectFicha = output<string>();
  readonly consultarFicha = output<Ficha>();
  readonly editarFicha = output<Ficha>();
  readonly eliminarFicha = output<Ficha>();

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchChange.emit(target.value);
  }

  onRowClick(codigo: string): void {
    this.selectFicha.emit(codigo);
  }

  onConsultar(event: Event, ficha: Ficha): void {
    event.stopPropagation();
    this.consultarFicha.emit(ficha);
  }

  onEditar(event: Event, ficha: Ficha): void {
    event.stopPropagation();
    this.editarFicha.emit(ficha);
  }

  onEliminar(event: Event, ficha: Ficha): void {
    event.stopPropagation();
    this.eliminarFicha.emit(ficha);
  }
}
