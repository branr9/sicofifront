import { Injectable, computed, signal } from '@angular/core';
import {
  DIAS_TECNICO_TECNOLOGO,
  DiaSemana,
  Ficha,
  FichaCreatePayload,
  FichaEditPayload,
  HistorialCambio,
  RapAvance,
  ToastNotificacion,
} from '../models/ficha.model';

const ABREVIATURAS_DIAS: Record<DiaSemana, string> = {
  Lunes: 'Lun',
  Martes: 'Mar',
  Miércoles: 'Mié',
  Jueves: 'Jue',
  Viernes: 'Vie',
  Sábado: 'Sáb',
  Domingo: 'Dom',
};

const FICHAS_INICIALES: Ficha[] = [
  {
    codigo: '2395063',
    nombre: 'Gestión Logística 2021-2',
    codProyecto: '152637',
    codPrograma: '238101030',
    version: 'V1',
    jornada: 'Mañana',
    nivelFormacion: 'Tecnólogo',
    fechaInicio: '19/07/2021',
    fechaTermino: '18/10/2022',
    dias: 'Lun-Vie',
    diasLista: [...DIAS_TECNICO_TECNOLOGO],
    sede: 'Sagrado',
    instructorLider: 'Pinillos',
    raps: [
      {
        codigo: '220501092-01',
        descripcion: 'Especificar los requisitos del software según las necesidades del cliente',
        porcentaje: 100,
        estado: 'Aprobado',
      },
      {
        codigo: '220501092-02',
        descripcion: 'Diseñar la arquitectura del software empleando diagramas UML y modelo ER',
        porcentaje: 85,
        estado: 'En ejecución',
      },
      {
        codigo: '220501093-01',
        descripcion: 'Desarrollar componentes del sistema backend utilizando Java / JavaScript',
        porcentaje: 50,
        estado: 'En progreso',
      },
      {
        codigo: '220501093-02',
        descripcion: 'Implantar pruebas unitarias e integración en el entorno de pruebas',
        porcentaje: 15,
        estado: 'Pendiente',
      },
    ],
  },
  {
    codigo: '2313782',
    nombre: 'Análisis y Desarrollo de Software',
    codProyecto: '152637',
    codPrograma: '228106000',
    version: 'V2',
    jornada: 'Noche',
    nivelFormacion: 'Tecnólogo',
    fechaInicio: '15/01/2021',
    fechaTermino: '15/04/2022',
    dias: 'Lun-Vie',
    diasLista: [...DIAS_TECNICO_TECNOLOGO],
    sede: 'Salesiano',
    instructorLider: 'German',
    raps: [
      {
        codigo: '220501094-01',
        descripcion: 'Levantar requerimientos funcionales y no funcionales del sistema',
        porcentaje: 100,
        estado: 'Aprobado',
      },
      {
        codigo: '220501094-02',
        descripcion: 'Construir interfaces web responsivas con frameworks modernos',
        porcentaje: 100,
        estado: 'Aprobado',
      },
      {
        codigo: '220501095-01',
        descripcion: 'Implementar servicios REST y persistencia en base de datos relacional',
        porcentaje: 75,
        estado: 'En ejecución',
      },
      {
        codigo: '220501095-02',
        descripcion: 'Desplegar solución y documentar manual técnico de usuario',
        porcentaje: 40,
        estado: 'En progreso',
      },
    ],
  },
  {
    codigo: '2401923',
    nombre: 'Gestión Empresarial',
    codProyecto: '189231',
    codPrograma: '128302040',
    version: 'V1',
    jornada: 'Tarde',
    nivelFormacion: 'Técnico',
    fechaInicio: '10/02/2022',
    fechaTermino: '10/05/2023',
    dias: 'Lun-Vie',
    diasLista: [...DIAS_TECNICO_TECNOLOGO],
    sede: 'Bicentenario',
    instructorLider: 'Brandon',
    raps: [
      {
        codigo: '210601020-01',
        descripcion: 'Proponer alternativas de solución que contribuyan al logro de los objetivos',
        porcentaje: 100,
        estado: 'Aprobado',
      },
      {
        codigo: '210601020-02',
        descripcion: 'Elaborar informes ejecutivos según lineamientos organizacionales',
        porcentaje: 60,
        estado: 'En progreso',
      },
      {
        codigo: '210601021-01',
        descripcion: 'Gestionar indicadores de desempeño y seguimiento administrativo',
        porcentaje: 25,
        estado: 'Pendiente',
      },
    ],
  },
];

const HISTORIAL_INICIAL: HistorialCambio[] = [
  {
    id: 'hist-1',
    fichaCodigo: '2395063',
    titulo: 'Ficha #2395063 - Edición de Instructor Líder',
    detalle: 'Cambiado a: Pinillos | Sede: Sagrado',
    fecha: '27 Jul 2026',
    tipo: 'edicion',
  },
];

@Injectable()
export class FichasService {
  private readonly fichasState = signal<Ficha[]>(FICHAS_INICIALES);
  private readonly searchTermState = signal<string>('');
  private readonly selectedFichaCodigoState = signal<string>(FICHAS_INICIALES[0].codigo);
  private readonly historialState = signal<HistorialCambio[]>(HISTORIAL_INICIAL);
  private readonly toastState = signal<ToastNotificacion | null>(null);
  private toastTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly fichas = this.fichasState.asReadonly();
  readonly searchTerm = this.searchTermState.asReadonly();
  readonly historial = this.historialState.asReadonly();
  readonly toast = this.toastState.asReadonly();

  readonly filteredFichas = computed(() => {
    const term = this.searchTermState().trim().toLowerCase();
    const list = this.fichasState();
    if (!term) {
      return list;
    }
    return list.filter((ficha) =>
      [
        ficha.codigo,
        ficha.nombre,
        ficha.codProyecto,
        ficha.codPrograma,
        ficha.version,
        ficha.jornada,
        ficha.nivelFormacion,
        ficha.sede,
        ficha.instructorLider,
        ficha.dias,
      ]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  });

  readonly selectedFicha = computed<Ficha | null>(() => {
    const list = this.fichasState();
    const code = this.selectedFichaCodigoState();
    return list.find((f) => f.codigo === code) ?? list[0] ?? null;
  });

  setSearchTerm(term: string): void {
    this.searchTermState.set(term);
  }

  selectFicha(codigo: string): void {
    this.selectedFichaCodigoState.set(codigo);
  }

  createFicha(payload: FichaCreatePayload): { ok: boolean; error?: string } {
    const codigo = payload.codigo.trim();
    const existe = this.fichasState().some((f) => f.codigo === codigo);

    if (existe) {
      const error = `Ya existe una ficha con el código ${codigo}.`;
      this.notify('error', error);
      return { ok: false, error };
    }

    const nuevaFicha: Ficha = {
      codigo,
      nombre: payload.nombre.trim(),
      codProyecto: payload.codProyecto?.trim() || '100100',
      codPrograma: payload.codPrograma.trim(),
      version: payload.version.trim().toUpperCase(),
      jornada: payload.jornada,
      nivelFormacion: payload.nivelFormacion,
      fechaInicio: formatIsoToDisplayDate(payload.fechaInicio),
      fechaTermino: formatIsoToDisplayDate(payload.fechaTermino),
      dias: formatDiasResumen(payload.diasLista),
      diasLista: [...payload.diasLista],
      sede: payload.sede,
      instructorLider: payload.instructorLider,
      raps: generarRapsIniciales(payload.codPrograma.trim()),
    };

    this.fichasState.update((list) => [...list, nuevaFicha]);
    this.selectedFichaCodigoState.set(nuevaFicha.codigo);
    this.registrarHistorial(
      nuevaFicha.codigo,
      `Ficha #${nuevaFicha.codigo} - Registro inicial`,
      `Programa: ${nuevaFicha.codPrograma} | Sede: ${nuevaFicha.sede} | Líder: ${nuevaFicha.instructorLider}`,
      'creacion'
    );
    this.notify('success', `¡Ficha ${nuevaFicha.codigo} creada exitosamente!`);
    return { ok: true };
  }

  updateFicha(payload: FichaEditPayload): void {
    const fechaFormateada = formatIsoToDisplayDate(payload.fechaTerminoIso);

    this.fichasState.update((list) =>
      list.map((ficha) =>
        ficha.codigo === payload.codigo
          ? {
              ...ficha,
              fechaTermino: fechaFormateada || ficha.fechaTermino,
              sede: payload.sede,
              instructorLider: payload.instructorLider,
            }
          : ficha
      )
    );

    this.registrarHistorial(
      payload.codigo,
      `Ficha #${payload.codigo} - Actualización de ficha`,
      `Líder: ${payload.instructorLider} | Sede: ${payload.sede} | Término: ${fechaFormateada}`,
      'edicion'
    );
    this.notify('success', `Cambios guardados en la ficha #${payload.codigo}.`);
  }

  deleteFicha(codigo: string): void {
    const target = this.fichasState().find((f) => f.codigo === codigo);
    if (!target) {
      return;
    }

    this.fichasState.update((list) => list.filter((f) => f.codigo !== codigo));

    if (this.selectedFichaCodigoState() === codigo) {
      const remaining = this.fichasState();
      this.selectedFichaCodigoState.set(remaining[0]?.codigo ?? '');
    }

    this.registrarHistorial(
      codigo,
      `Ficha #${codigo} - Ficha eliminada`,
      `Programa: ${target.nombre} | Sede: ${target.sede}`,
      'eliminacion'
    );
    this.notify('info', `Ficha #${codigo} eliminada del listado.`);
  }

  clearToast(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
    this.toastState.set(null);
  }

  private registrarHistorial(
    fichaCodigo: string,
    titulo: string,
    detalle: string,
    tipo: HistorialCambio['tipo']
  ): void {
    const entry: HistorialCambio = {
      id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      fichaCodigo,
      titulo,
      detalle,
      fecha: formatTodayLabel(),
      tipo,
    };
    this.historialState.update((items) => [entry, ...items]);
  }

  private notify(tipo: ToastNotificacion['tipo'], mensaje: string): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastState.set({ tipo, mensaje });
    this.toastTimeout = setTimeout(() => {
      this.toastState.set(null);
      this.toastTimeout = null;
    }, 4000);
  }
}

export function formatIsoToDisplayDate(isoDate: string): string {
  if (!isoDate) {
    return '';
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(isoDate)) {
    return isoDate;
  }
  const parts = isoDate.split('-');
  if (parts.length !== 3) {
    return isoDate;
  }
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

export function formatDisplayToIsoDate(displayDate: string): string {
  if (!displayDate) {
    return '';
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(displayDate)) {
    return displayDate;
  }
  const parts = displayDate.split('/');
  if (parts.length !== 3) {
    return '';
  }
  const [day, month, year] = parts;
  return `${year}-${month}-${day}`;
}

export function formatDiasResumen(dias: readonly DiaSemana[]): string {
  if (dias.length === 0) {
    return 'Sin definir';
  }
  const esLunAVie =
    dias.length === DIAS_TECNICO_TECNOLOGO.length &&
    DIAS_TECNICO_TECNOLOGO.every((dia) => dias.includes(dia));

  if (esLunAVie) {
    return 'Lun-Vie';
  }

  return dias.map((dia) => ABREVIATURAS_DIAS[dia]).join(', ');
}

function formatTodayLabel(): string {
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, '0');
  const mes = meses[hoy.getMonth()] ?? 'Ene';
  return `${dia} ${mes} ${hoy.getFullYear()}`;
}

function generarRapsIniciales(codPrograma: string): RapAvance[] {
  return [
    {
      codigo: `${codPrograma || '220501'}-01`,
      descripcion: 'Identificar requerimientos y alcance inicial del proyecto formativo',
      porcentaje: 100,
      estado: 'Aprobado',
    },
    {
      codigo: `${codPrograma || '220501'}-02`,
      descripcion: 'Planificar fases técnicas y entregables de competencia',
      porcentaje: 40,
      estado: 'En progreso',
    },
    {
      codigo: `${codPrograma || '220501'}-03`,
      descripcion: 'Ejecutar validación funcional y evidencias de aprendizaje',
      porcentaje: 0,
      estado: 'Pendiente',
    },
  ];
}
