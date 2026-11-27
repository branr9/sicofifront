import { Injectable, signal } from '@angular/core';
import {
  CategoriaCompetencia,
  Competencia,
  CompetenciaAsignada,
  Programa,
  ProgramaForm,
} from '../models/programas.model';

@Injectable({ providedIn: 'root' })
export class ProgramasService {
  readonly programas = signal<Programa[]>([]);
  readonly competencias = signal<Competencia[]>([]);
  readonly proyectos = signal<{ codigo: string; nombre: string }[]>([]);

  crearPrograma(formulario: ProgramaForm): boolean {
    if (
      !formulario.nombre.trim() ||
      !formulario.nivel ||
      !formulario.codigo.trim() ||
      !formulario.version.trim()
    ) {
      return false;
    }

    const nuevoPrograma: Programa = {
      codigo: formulario.codigo.trim(),
      nombre: formulario.nombre.trim(),
      nivel: formulario.nivel,
      version: formulario.version.trim(),
      activo: true,
      proyecto: formulario.proyecto,
      competencias: formulario.competencias,
    };

    this.programas.update((programas) => [nuevoPrograma, ...programas]);
    return true;
  }

  asignarCompetencia(
    asignadas: CompetenciaAsignada[],
    competencia: Competencia,
    categoria: CategoriaCompetencia = competencia.categoria,
  ): CompetenciaAsignada[] {
    const existente = asignadas.find(
      (item) => item.competencia.codigo === competencia.codigo,
    );
    if (existente) {
      return asignadas.map((item) =>
        item.competencia.codigo === competencia.codigo
          ? { ...item, categoria, horas: competencia.horas }
          : item,
      );
    }
    return [
      ...asignadas,
      { competencia, categoria, horas: competencia.horas },
    ];
  }

  quitarCompetencia(
    asignadas: CompetenciaAsignada[],
    codigo: string,
  ): CompetenciaAsignada[] {
    return asignadas.filter((item) => item.competencia.codigo !== codigo);
  }
}
