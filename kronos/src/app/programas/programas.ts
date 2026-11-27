import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CategoriaCompetencia,
  CompetenciaAsignada,
  ProgramaForm,
} from './models/programas.model';
import { ProgramasService } from './services/programas.service';

@Component({
  selector: 'app-programas',
  imports: [FormsModule],
  templateUrl: './programas.html',
  styleUrl: './programas.css',
})
export class Programas {
  private readonly programasService = inject(ProgramasService);

  protected readonly busqueda = signal('');
  protected readonly modalVisible = signal(false);
  protected readonly filtroCompetencias = signal('');
  protected readonly competenciasAsignadas = signal<CompetenciaAsignada[]>([]);
  protected readonly mensajeError = signal('');
  protected readonly competencias = this.programasService.competencias;
  protected readonly proyectos = this.programasService.proyectos;
  protected readonly programaForm: ProgramaForm = {
    nombre: '',
    nivel: '',
    codigo: '',
    version: '',
    competencias: [],
  };

  protected readonly programas = this.programasService.programas;

  protected readonly programasFiltrados = computed(() => {
    const texto = this.busqueda().trim().toLocaleLowerCase();
    if (!texto) {
      return this.programas();
    }

    return this.programas().filter((programa) =>
      [programa.codigo, programa.nombre, programa.nivel, programa.version]
        .join(' ')
        .toLocaleLowerCase()
        .includes(texto),
    );
  });

  protected readonly competenciasFiltradas = computed(() => {
    const texto = this.filtroCompetencias().trim().toLocaleLowerCase();
    return this.competencias().filter((competencia) =>
        `${competencia.codigo} ${competencia.nombre}`.toLocaleLowerCase().includes(texto),
    );
  });

  protected readonly totalHoras = computed(() =>
    this.competenciasAsignadas().reduce(
        (total, asignada) => total + asignada.horas,
        0,
    ),
  );

  protected readonly totalTecnicas = computed(() =>
    this.competenciasAsignadas().filter(
        (item) => item.categoria === 'tecnicas',
    ).length,
  );

  protected readonly totalTransversales = computed(() =>
    this.competenciasAsignadas().filter(
        (item) => item.categoria === 'transversales',
    ).length,
  );

  protected readonly totalBilinguismo = computed(() =>
    this.competenciasAsignadas().filter(
        (item) => item.categoria === 'bilinguismo',
    ).length,
  );

  protected readonly competenciesAssignedResults = computed(() =>
    this.competenciasAsignadas().reduce(
        (total, asignada) => total + asignada.competencia.resultados,
        0,
    ),
  );

  abrirModal(): void {
    this.reiniciarFormulario();
    this.modalVisible.set(true);
  }

  cerrarModal(): void {
    this.modalVisible.set(false);
  }

  seleccionarProyecto(codigo: string): void {
    this.programaForm.proyecto =
        this.proyectos().find((proyecto) => proyecto.codigo === codigo);
  }

  asignarCompetencia(codigo: string): void {
    this.asignarCompetenciaEnCategoria(codigo, 'tecnicas');
  }

  asignarCompetenciaEnCategoria(
    codigo: string,
    categoria: CategoriaCompetencia,
  ): void {
    const competencia = this.competencias().find((item) => item.codigo === codigo);
    if (competencia) {
        this.competenciasAsignadas.set(
          this.programasService.asignarCompetencia(
            this.competenciasAsignadas(),
            competencia,
            categoria,
          ),
        );
    }
  }

  iniciarArrastre(event: DragEvent, codigo: string): void {
    event.dataTransfer?.setData('text/plain', codigo);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  permitirSoltar(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  soltarCompetencia(
    event: DragEvent,
    categoria: CategoriaCompetencia,
  ): void {
    event.preventDefault();
    const codigo = event.dataTransfer?.getData('text/plain');
    if (codigo) {
      this.asignarCompetenciaEnCategoria(codigo, categoria);
    }
  }

  quitarCompetencia(codigo: string): void {
    this.competenciasAsignadas.set(
        this.programasService.quitarCompetencia(
          this.competenciasAsignadas(),
          codigo,
        ),
    );
  }

  crearPrograma(): void {
    this.programaForm.competencias = this.competenciasAsignadas();
    if (!this.programasService.crearPrograma(this.programaForm)) {
        this.mensajeError.set('Completa los campos obligatorios antes de guardar.');
        return;
    }
    this.mensajeError.set('');
    this.modalVisible.set(false);
  }

  reiniciarFormulario(): void {
    this.programaForm.nombre = '';
    this.programaForm.nivel = '';
    this.programaForm.codigo = '';
    this.programaForm.version = '';
    this.programaForm.proyecto = undefined;
    this.programaForm.competencias = [];
    this.competenciasAsignadas.set([]);
    this.filtroCompetencias.set('');
    this.mensajeError.set('');
  }
}
