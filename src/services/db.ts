import Dexie, { type EntityTable } from 'dexie';
import type { User, Category, Product, Cliente } from '../types';

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

