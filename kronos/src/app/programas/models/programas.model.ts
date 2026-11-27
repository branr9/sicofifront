export type NivelPrograma = 'Tecnólogo' | 'Técnico';
export type CategoriaCompetencia = 'transversales' | 'tecnicas' | 'bilinguismo';

export interface ProyectoPrograma {
  codigo: string;
  nombre: string;
}

export interface Programa {
  codigo: string;
  nombre: string;
  nivel: NivelPrograma;
  version: string;
  activo: boolean;
  proyecto?: ProyectoPrograma;
  competencias?: CompetenciaAsignada[];
}

export interface ProgramaForm {
  nombre: string;
  nivel: NivelPrograma | '';
  codigo: string;
  version: string;
  proyecto?: ProyectoPrograma;
  competencias: CompetenciaAsignada[];
}

export interface Competencia {
  codigo: string;
  nombre: string;
  resultados: number;
  categoria: CategoriaCompetencia;
  horas: number;
}

export interface CompetenciaAsignada {
  competencia: Competencia;
  horas: number;
  categoria: CategoriaCompetencia;
}
