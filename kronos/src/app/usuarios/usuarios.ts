import { Component, computed, signal } from '@angular/core';

export interface UsuarioFila {
  documento: string;
  nombre: string;
  rol: string;
  estado: 'Activo' | 'Inactivo';
}

@Component({
  selector: 'app-usuarios',
  imports: [],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios {
  protected readonly busqueda = signal('');

  protected readonly usuarios = signal<UsuarioFila[]>([
    { documento: '10101010', nombre: 'Juan Pérez', rol: 'Instructor', estado: 'Activo' },
    { documento: '22222222', nombre: 'María Gómez', rol: 'Coordinador', estado: 'Activo' },
    {
      documento: '33333333',
      nombre: 'Carlos Ruiz',
      rol: 'Apoyo coordinación',
      estado: 'Inactivo',
    },
    { documento: '44444444', nombre: 'Ana Torres', rol: 'Instructor', estado: 'Activo' },
  ]);

  protected readonly usuariosFiltrados = computed(() => {
    const filtro = this.busqueda().trim().toLowerCase();
    if (!filtro) return this.usuarios();

    return this.usuarios().filter(
      (u) =>
        u.documento.toLowerCase().includes(filtro) ||
        u.nombre.toLowerCase().includes(filtro) ||
        u.rol.toLowerCase().includes(filtro) ||
        u.estado.toLowerCase().includes(filtro),
    );
  });

  protected onBuscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busqueda.set(input.value);
  }

  protected eliminarUsuario(documento: string): void {
    this.usuarios.update((lista) => lista.filter((u) => u.documento !== documento));
  }
}