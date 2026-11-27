import { Component, input, output } from '@angular/core';
import { HistorialCambio } from '../../models/ficha.model';

@Component({
  selector: 'app-ficha-historial-modal',
  standalone: true,
  imports: [],
  templateUrl: './ficha-historial-modal.html',
  styleUrl: './ficha-historial-modal.css',
})
export class FichaHistorialModal {
  readonly isOpen = input<boolean>(false);
  readonly historial = input.required<HistorialCambio[]>();
  readonly close = output<void>();

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
