import { Component, input, output } from '@angular/core';
import { Ficha } from '../../models/ficha.model';

@Component({
  selector: 'app-ficha-detalle-modal',
  standalone: true,
  imports: [],
  templateUrl: './ficha-detalle-modal.html',
  styleUrl: './ficha-detalle-modal.css',
})
export class FichaDetalleModal {
  readonly ficha = input<Ficha | null>(null);
  readonly close = output<void>();
  readonly editRequested = output<Ficha>();

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
