export type NivelFormacion = 'Técnico' | 'Tecnólogo';
export type Jornada = 'Mañana' | 'Tarde' | 'Noche';
export type Sede = 'Sagrado' | 'Salesiano' | 'Bicentenario';
export type InstructorLider = 'Pinillos' | 'German' | 'Brandon';
export type TipoProgramacionDias = '' | 'tecnico-tecnologo' | 'otro';
export type EstadoRap = 'Aprobado' | 'En ejecución' | 'En progreso' | 'Pendiente';

export type DiaSemana =
  | 'Lunes'
  | 'Martes'
  | 'Miércoles'
  | 'Jueves'
  | 'Viernes'
  | 'Sábado'
  | 'Domingo';

export interface RapAvance {
  codigo: string;
  descripcion: string;
  porcentaje: number;
  estado: EstadoRap;
}

export interface Ficha {
  codigo: string;
  nombre: string;
  codProyecto: string;
  codPrograma: string;
  version: string;
  jornada: Jornada;
  nivelFormacion: NivelFormacion;
  fechaInicio: string;
  fechaTermino: string;
  dias: string;
  diasLista: DiaSemana[];
  sede: Sede;
  instructorLider: InstructorLider;
  raps: RapAvance[];
}

export interface FichaCreatePayload {
  codigo: string;
  nombre: string;
  codProyecto?: string;
  codPrograma: string;
  version: string;
  jornada: Jornada;
  nivelFormacion: NivelFormacion;
  fechaInicio: string;
  fechaTermino: string;
  diasLista: DiaSemana[];
  sede: Sede;
  instructorLider: InstructorLider;
}

export interface FichaEditPayload {
  codigo: string;
  fechaTerminoIso: string;
  sede: Sede;
  instructorLider: InstructorLider;
}

export interface HistorialCambio {
  id: string;
  fichaCodigo: string;
  titulo: string;
  detalle: string;
  fecha: string;
  tipo: 'creacion' | 'edicion' | 'eliminacion';
}

export interface ToastNotificacion {
  tipo: 'success' | 'error' | 'info';
  mensaje: string;
}

export const DIAS_SEMANA: readonly DiaSemana[] = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

export const DIAS_TECNICO_TECNOLOGO: readonly DiaSemana[] = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
];

export const SEDES_DISPONIBLES: readonly Sede[] = ['Sagrado', 'Salesiano', 'Bicentenario'];
export const JORNADAS_DISPONIBLES: readonly Jornada[] = ['Mañana', 'Tarde', 'Noche'];
export const NIVELES_DISPONIBLES: readonly NivelFormacion[] = ['Técnico', 'Tecnólogo'];
export const INSTRUCTORES_DISPONIBLES: readonly InstructorLider[] = ['Pinillos', 'German', 'Brandon'];
