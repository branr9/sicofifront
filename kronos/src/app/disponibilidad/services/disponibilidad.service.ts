import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import {
  CeldaCoordenada,
  DIAS_SEMANA,
  EstadoMensaje,
  FILAS_NOCTURNAS,
  HORAS_DIA,
  INSTRUCTORES_CATALOGO,
  Instructor,
} from '../models/disponibilidad.model';

/**
 * Servicio encargado de gestionar el estado de disponibilidad horaria,
 * selección de instructores y acciones sobre las restricciones.
 */
@Injectable({ providedIn: 'root' })
export class DisponibilidadService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  readonly horas = HORAS_DIA;
  readonly dias = DIAS_SEMANA;
  readonly instructores = INSTRUCTORES_CATALOGO;

  readonly instructorSeleccionadoId = signal<string>('');
  readonly mensaje = signal<EstadoMensaje | null>(null);
  readonly matrizRestricciones = signal<boolean[][]>(this.crearMatrizInicial());

  readonly instructorSeleccionado = computed<Instructor | null>(() => {
    const id = this.instructorSeleccionadoId();
    return this.instructores.find((item) => item.id === id) ?? null;
  });

  readonly totalHorasRestringidas = computed<number>(() => {
    return this.matrizRestricciones().reduce(
      (acumulado, fila) => acumulado + fila.filter(Boolean).length,
      0,
    );
  });

  constructor() {
    this.aplicarRestriccionNocturna();
  }

  /** Selecciona un instructor por su identificador y limpia el mensaje de estado. */
  seleccionarInstructor(id: string): void {
    this.instructorSeleccionadoId.set(id);
    this.ocultarMensaje();
  }

  /** Alterna el estado restringido de una celda individual. */
  alternarCelda(fila: number, columna: number): void {
    this.matrizRestricciones.update((matriz) =>
      matriz.map((row, rIndex) =>
        rIndex === fila
          ? row.map((valor, cIndex) => (cIndex === columna ? !valor : valor))
          : row,
      ),
    );
  }

  /** Alterna todas las columnas de una hora específica. */
  restringirHora(fila: number): void {
    const coordenadas: CeldaCoordenada[] = this.dias.map((_, columna) => ({
      fila,
      columna,
    }));
    this.alternarGrupoCeldas(coordenadas);
  }

  /** Alterna todas las horas de un día específico. */
  seleccionarDia(columna: number): void {
    const coordenadas: CeldaCoordenada[] = this.horas.map((_, fila) => ({
      fila,
      columna,
    }));
    this.alternarGrupoCeldas(coordenadas);
  }

  /** Alterna todas las celdas de la cuadrícula horaria. */
  seleccionarTodasLasHoras(): void {
    const coordenadas: CeldaCoordenada[] = [];
    for (let fila = 0; fila < this.horas.length; fila++) {
      for (let columna = 0; columna < this.dias.length; columna++) {
        coordenadas.push({ fila, columna });
      }
    }
    this.alternarGrupoCeldas(coordenadas);
  }

  /** Alterna la franja nocturna (22:00 - 06:00) para todos los días. */
  aplicarRestriccionNocturna(): void {
    const coordenadas: CeldaCoordenada[] = [];
    for (const fila of FILAS_NOCTURNAS) {
      for (let columna = 0; columna < this.dias.length; columna++) {
        coordenadas.push({ fila, columna });
      }
    }
    this.alternarGrupoCeldas(coordenadas);
  }

  /** Valida y confirma el guardado de restricciones del instructor actual. */
  guardarRestricciones(): void {
    if (!this.instructorSeleccionado()) {
      this.mostrarMensaje('Primero debes seleccionar un instructor.', true);
      return;
    }

    if (this.totalHorasRestringidas() === 0) {
      this.mostrarMensaje('Debes seleccionar al menos una hora.', true);
      return;
    }

    this.mostrarMensaje('Las restricciones fueron guardadas correctamente.', false);
  }

  /** Genera el enlace mailto con el detalle de restricciones y lo abre en el navegador. */
  enviarInformacionInstructor(): string | null {
    const instructor = this.instructorSeleccionado();
    if (!instructor) {
      this.mostrarMensaje('Primero debes seleccionar un instructor.', true);
      return null;
    }

    const seleccionadas = this.obtenerCeldasRestringidas();
    if (seleccionadas.length === 0) {
      this.mostrarMensaje(
        'Debes seleccionar al menos una hora antes de enviar la información.',
        true,
      );
      return null;
    }

    const informacionHorarios = seleccionadas
      .map(({ fila, columna }) => `- ${this.dias[columna]} a las ${this.horas[fila]}\n`)
      .join('');

    const asunto = 'Información de disponibilidad asignada';
    const cuerpoMensaje =
      `Hola ${instructor.nombre},\n\n` +
      'A continuación se encuentra la información de las horas asignadas en el sistema.\n\n' +
      `Nombre: ${instructor.nombre}\n` +
      `Correo: ${instructor.correo}\n` +
      `Teléfono: ${instructor.telefono}\n\n` +
      `Total de horas seleccionadas: ${seleccionadas.length}\n\n` +
      'Horarios seleccionados:\n' +
      `${informacionHorarios}\n` +
      'Por favor, revise la información asignada.\n\n' +
      'Saludos.';

    const mailtoUrl =
      `mailto:${instructor.correo}` +
      `?subject=${encodeURIComponent(asunto)}` +
      `&body=${encodeURIComponent(cuerpoMensaje)}`;

    if (isPlatformBrowser(this.platformId) && this.document?.defaultView) {
      this.document.defaultView.location.href = mailtoUrl;
    }

    this.mostrarMensaje(
      'Se preparó el correo con la información del instructor.',
      false,
    );
    return mailtoUrl;
  }

  ocultarMensaje(): void {
    this.mensaje.set(null);
  }

  private mostrarMensaje(texto: string, esError: boolean): void {
    this.mensaje.set({ texto, esError });
  }

  private crearMatrizInicial(): boolean[][] {
    return Array.from({ length: this.horas.length }, () =>
      Array.from({ length: this.dias.length }, () => false),
    );
  }

  private obtenerCeldasRestringidas(): CeldaCoordenada[] {
    const matriz = this.matrizRestricciones();
    const resultado: CeldaCoordenada[] = [];
    for (let fila = 0; fila < matriz.length; fila++) {
      for (let columna = 0; columna < matriz[fila].length; columna++) {
        if (matriz[fila][columna]) {
          resultado.push({ fila, columna });
        }
      }
    }
    return resultado;
  }

  /**
   * Si todas las celdas del grupo están restringidas las libera;
   * en caso contrario marca todas como restringidas.
   */
  private alternarGrupoCeldas(coordenadas: CeldaCoordenada[]): void {
    this.matrizRestricciones.update((matriz) => {
      const todasSeleccionadas = coordenadas.every(
        ({ fila, columna }) => matriz[fila]?.[columna] === true,
      );
      const nuevoEstado = !todasSeleccionadas;
      const objetivoPorFila = new Map<number, Set<number>>();

      for (const { fila, columna } of coordenadas) {
        let cols = objetivoPorFila.get(fila);
        if (!cols) {
          cols = new Set<number>();
          objetivoPorFila.set(fila, cols);
        }
        cols.add(columna);
      }

      return matriz.map((row, rIndex) => {
        const cols = objetivoPorFila.get(rIndex);
        if (!cols) {
          return row;
        }
        return row.map((valor, cIndex) =>
          cols.has(cIndex) ? nuevoEstado : valor,
        );
      });
    });
  }
}
