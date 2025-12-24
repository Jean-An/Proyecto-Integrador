import Dexie, { type EntityTable } from 'dexie';
import type { User, Category, Product, Cliente, Brand, Provider, Transportista, Empleado, Guia, DetalleGuia, GuiaIngreso, GuiaSalida } from '../types';

const db = new Dexie('MyDatabase') as Dexie & {
  users: EntityTable<
    User,
    'id' // primary key "id" (for the typings only)
  >;
  categorias: EntityTable<Category, 'id'>;
  productos: EntityTable<Product, 'id'>;
  clientes: EntityTable<Cliente, 'id'>;
  marcas: EntityTable<Brand, 'id'>;
  proveedores: EntityTable<Provider, 'id'>;
  transportistas: EntityTable<Transportista, 'id'>;
  empleados: EntityTable<Empleado, 'id'>;
  guias: EntityTable<Guia, 'id'>;
  detallesGuia: EntityTable<DetalleGuia, 'id'>;
  guiasIngreso: EntityTable<GuiaIngreso, 'id'>;
  guiasSalida: EntityTable<GuiaSalida, 'id'>;
};

// Schema declaration:
db.version(6).stores({ // Increment version to 6
  users: '++id, &email, password, name',
  categorias: '++id, nombre',
  productos: '++id, nombre, categoria, marca, estado',
  clientes: '++id, nombre, apellido, email, dni, estado',
  marcas: '++id, nombre',
  proveedores: '++id, ruc, nombre, apellido, correo, estado',
  transportistas: '++id, ruc, nombre, apellido, placa',
  empleados: '++id, nombre, apellido, correo',
  guias: '++id, empleado, fecha, tipo',
  detallesGuia: '++id, guiaId, producto',
  guiasIngreso: '++id, guiaId, proveedor',
  guiasSalida: '++id, guiaId, cliente, transportista'
});

export type { User, Category, Product, Cliente, Brand, Provider, Transportista, Empleado, Guia, DetalleGuia, GuiaIngreso, GuiaSalida };
export { db };

