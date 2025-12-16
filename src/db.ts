import Dexie, { type EntityTable } from 'dexie';

interface User {
  id: number;
  name: string;
  email: string;
  password: string; // Stored as plain text for this local-only dem
}


interface Category {
  id?: number;
  nombre: string;
}

interface Product {
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

interface Cliente {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
  direccion: string;
  estado: string;
}

const db = new Dexie('MyDatabase') as Dexie & {
  users: EntityTable<
    User,
    'id' // primary key "id" (for the typings only)
  >;
  categorias: EntityTable<Category, 'id'>;
  productos: EntityTable<Product, 'id'>;
  clientes: EntityTable<Cliente, 'id'>;
};

// Schema declaration:
db.version(2).stores({
  users: '++id, &email, password, name',
  categorias: '++id, nombre',
  productos: '++id, nombre, categoria, marca, estado',
  clientes: '++id, nombre, apellido, email, dni, estado'
});

export type { User, Category, Product, Cliente };
export { db };

