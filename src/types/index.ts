export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // Stored as plain text for this local-only dem
}

export interface Category {
  id?: number;
  nombre: string;
}

export interface Product {
  id?: number;
  nombre: string;
  descripcion?: string; // Optional
  categoria: string;
  precio: number;
  stock: number;
  marca: string;
  ubicacion?: string; // Optional
  estado: string;
}

export interface Cliente {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
  direccion: string;
  estado: string;
}
