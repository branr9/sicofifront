export interface Ficha {
  codigo: string;
  nombre: string;
}

export interface Instructor {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  foto: string;
  fichas: Ficha[];
}

export interface EstadoMensaje {
  texto: string;
  esError: boolean;
}

export interface CeldaCoordenada {
  fila: number;
  columna: number;
}

export const FOTO_SIN_SELECCION =
  'https://placehold.co/120x120/e2e8f0/475569?text=Sin+Foto';

export const FOTO_RESPALDO =
  'https://placehold.co/120x120/e2e8f0/475569?text=Instructor';

export const HORAS_DIA: readonly string[] = [
  '00:00 a. m.',
  '01:00 a. m.',
  '02:00 a. m.',
  '03:00 a. m.',
  '04:00 a. m.',
  '05:00 a. m.',
  '06:00 a. m.',
  '07:00 a. m.',
  '08:00 a. m.',
  '09:00 a. m.',
  '10:00 a. m.',
  '11:00 a. m.',
  '12:00 p. m.',
  '01:00 p. m.',
  '02:00 p. m.',
  '03:00 p. m.',
  '04:00 p. m.',
  '05:00 p. m.',
  '06:00 p. m.',
  '07:00 p. m.',
  '08:00 p. m.',
  '09:00 p. m.',
  '10:00 p. m.',
  '11:00 p. m.',
];

export const DIAS_SEMANA: readonly string[] = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

/** Filas correspondientes al rango nocturno 22:00 - 06:00. */
export const FILAS_NOCTURNAS: readonly number[] = [22, 23, 0, 1, 2, 3, 4, 5, 6];

export const INSTRUCTORES_CATALOGO: readonly Instructor[] = [
  {
    id: '1',
    nombre: 'Carlos Mendoza',
    correo: 'cmendoza@sena.edu.co',
    telefono: '300 123 4567',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    fichas: [
      { codigo: '3237741', nombre: 'ANÁLISIS Y DESARROLLO DE SOFTWARE' },
      { codigo: '2847590', nombre: 'GESTIÓN EN REDES DE DATOS' },
    ],
  },
  {
    id: '2',
    nombre: 'María Rodríguez',
    correo: 'mrodriguez@sena.edu.co',
    telefono: '310 987 6543',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    fichas: [
      { codigo: '2918372', nombre: 'DISEÑO E INTEGRACIÓN DE MULTIMEDIA' },
    ],
  },
  {
    id: '3',
    nombre: 'Juan Pablo Gómez',
    correo: 'jpgomez@sena.edu.co',
    telefono: '320 555 0199',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    fichas: [
      { codigo: '3237741', nombre: 'ANÁLISIS Y DESARROLLO DE SOFTWARE' },
      { codigo: '2710384', nombre: 'PROGRAMACIÓN PARA DISPOSITIVOS MÓVILES' },
    ],
  },
];
