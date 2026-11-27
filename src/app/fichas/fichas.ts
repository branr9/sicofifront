import { Component, HostListener, inject, signal } from '@angular/core';
import { FichaDetalleModal } from './components/ficha-detalle-modal/ficha-detalle-modal';
import { FichaEditModal } from './components/ficha-edit-modal/ficha-edit-modal';
import { FichaForm } from './components/ficha-form/ficha-form';
import { FichaHistorialModal } from './components/ficha-historial-modal/ficha-historial-modal';
import { FichaRapAvance } from './components/ficha-rap-avance/ficha-rap-avance';
import { FichasTabla } from './components/fichas-tabla/fichas-tabla';
import { Ficha, FichaCreatePayload, FichaEditPayload } from './models/ficha.model';
import { FichasService } from './services/fichas.service';

@Component({
  selector: 'app-fichas',
  standalone: true,
  imports: [
    FichasTabla,
    FichaForm,
    FichaRapAvance,
    FichaEditModal,
    FichaHistorialModal,
    FichaDetalleModal,
  ],
  providers: [FichasService],
  templateUrl: './fichas.html',
  styleUrl: './fichas.css',
})
export class Fichas {
  protected readonly fichasService = inject(FichasService);

  protected readonly editingFicha = signal<Ficha | null>(null);
  protected readonly viewingFicha = signal<Ficha | null>(null);
  protected readonly fichaToDelete = signal<Ficha | null>(null);
  protected readonly historialOpen = signal<boolean>(false);
  protected readonly formResetTick = signal<number>(0);

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.fichaToDelete()) {
      this.fichaToDelete.set(null);
      return;
    }
    if (this.editingFicha()) {
      this.editingFicha.set(null);
      return;
    }
    if (this.viewingFicha()) {
      this.viewingFicha.set(null);
      return;
    }
    if (this.historialOpen()) {
      this.historialOpen.set(false);
    }
  }

  onCreateFicha(payload: FichaCreatePayload): void {
    const result = this.fichasService.createFicha(payload);
    if (result.ok) {
      this.formResetTick.update((value) => value + 1);
    }
  }

  onConsultarFicha(ficha: Ficha): void {
    this.fichasService.selectFicha(ficha.codigo);
    this.viewingFicha.set(ficha);
  }

  onEditFromDetail(ficha: Ficha): void {
    this.viewingFicha.set(null);
    this.editingFicha.set(ficha);
  }

  onSaveEdit(payload: FichaEditPayload): void {
    this.fichasService.updateFicha(payload);
    this.editingFicha.set(null);
  }

  onConfirmDelete(): void {
    const target = this.fichaToDelete();
    if (!target) {
      return;
    }
    this.fichasService.deleteFicha(target.codigo);
    this.fichaToDelete.set(null);
  }

  onDeleteBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.fichaToDelete.set(null);
    }
  }
}
