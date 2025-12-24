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

export interface Brand {
  id?: number;
  nombre: string;
}

export interface Provider {
  id?: number;
  ruc: string;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  correo: string;
  estado: string;
}

export interface Transportista {
  id?: number;
  ruc: string;
  nombre: string;
  apellido: string;
  placa: string;
}

export interface Empleado {
  id?: number;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  correo: string;
}

export interface Guia {
  id?: number;
  empleado: string; // Store name/ID as needed. Screenshot shows names.
  fecha: string;
  tipo: "Ingreso" | "Salida";
}

export interface DetalleGuia {
  id?: number;
  guiaId: string; // Or number, but screenshots often show "1"
  producto: string;
  cantidad: number;
}

export interface GuiaIngreso {
  id?: number;
  guiaId: string;
  proveedor: string;
}

export interface GuiaSalida {
  id?: number;
  guiaId: string;
  cliente: string;
  puertoPartida: string;
  puertoLlegada: string;
  transportista: string;
}
