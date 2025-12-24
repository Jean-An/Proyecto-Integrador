import { sequelize } from '../config/database';
import { User, Category, Brand, Product, Client, Provider, Employee, Transporter, Guide, GuideDetail, EntryGuide, ExitGuide } from '../models';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    console.log('Storage:', (sequelize as any).options.storage);
    
    // Sync database (force: true drops tables and recreates them)
    await sequelize.sync({ force: true }); 
    console.log('Database synced (cleared).');

    // --- Users ---
    const passwordHash = await bcrypt.hash('123456', 10);
    
    await User.bulkCreate([
      { name: 'Admin User', email: 'admin@company.com', password: passwordHash },
      { name: 'Vendedor User', email: 'vendedor@company.com', password: passwordHash },
      { name: 'Almacenero User', email: 'almacen@company.com', password: passwordHash },
    ]);
    console.log('Users created.');

    // --- Categories ---
    const categories = await Category.bulkCreate([
      { nombre: 'Electronica' },
      { nombre: 'Muebles' },
      { nombre: 'Ropa' },
      { nombre: 'Juguetes' },
      { nombre: 'Hogar' },
    ]);
    console.log('Categories created.');

    // --- Brands ---
    const brands = await Brand.bulkCreate([
      { nombre: 'Samsung' },
      { nombre: 'Apple' },
      { nombre: 'Sony' },
      { nombre: 'IKEA' },
      { nombre: 'Nike' },
      { nombre: 'Adidas' },
      { nombre: 'Lego' },
      { nombre: 'Oster' },
    ]);
    console.log('Brands created.');

    // --- Products ---
    // Strictly dependent on created categories and brands
    const products = await Product.bulkCreate([
      { 
        nombre: 'Galaxy S24', 
        descripcion: 'Latest Samsung flagship', 
        precio: 999.99, 
        stock: 50, 
        categoria: categories[0].nombre, // Electronica
        marca: brands[0].nombre, // Samsung
        ubicacion: 'A1',
        estado: 'Activo'
      },
      { 
        nombre: 'iPhone 15', 
        descripcion: 'Latest Apple flagship', 
        precio: 1099.99, 
        stock: 40, 
        categoria: categories[0].nombre, // Electronica
        marca: brands[1].nombre, // Apple
        ubicacion: 'A2',
        estado: 'Activo'
      },
      { 
        nombre: 'PlayStation 5', 
        descripcion: 'Next-gen console', 
        precio: 499.99, 
        stock: 30, 
        categoria: categories[0].nombre, // Electronica
        marca: brands[2].nombre, // Sony
        ubicacion: 'A3',
        estado: 'Activo'
      },
      { 
        nombre: 'Escritorio Gamer', 
        descripcion: 'Mesa ergonómica', 
        precio: 150.00, 
        stock: 20, 
        categoria: categories[1].nombre, // Muebles
        marca: brands[3].nombre, // IKEA
        ubicacion: 'B1',
        estado: 'Activo'
      },
      { 
        nombre: 'Zapatillas Running', 
        descripcion: 'Para correr', 
        precio: 80.00, 
        stock: 100, 
        categoria: categories[2].nombre, // Ropa
        marca: brands[4].nombre, // Nike
        ubicacion: 'C1',
        estado: 'Activo'
      },
    ]);
    console.log('Products created.');

    // --- Clients ---
    const clients = await Client.bulkCreate([
      { nombre: 'Juan', apellido: 'Perez', email: 'juan@example.com', telefono: '555-0101', direccion: 'Calle Falsa 123', dni: '12345678', estado: 'Activo' },
      { nombre: 'Maria', apellido: 'Lopez', email: 'maria@example.com', telefono: '555-0102', direccion: 'Av. Siempre Viva 742', dni: '87654321', estado: 'Activo' },
      { nombre: 'Carlos', apellido: 'Sanchez', email: 'carlos@example.com', telefono: '555-0103', direccion: 'Jr. Union 101', dni: '11223344', estado: 'Activo' },
    ]);
    console.log('Clients created.');

    // --- Providers ---
    const providers = await Provider.bulkCreate([
      { nombre: 'Tech', apellido: 'Supplier', correo: 'contact@techsupplier.com', telefono: '555-1001', direccion: 'Tech Park 1', ruc: '20123456789', estado: 'Activo' },
      { nombre: 'Furniture', apellido: 'Depot', correo: 'sales@furnituredepot.com', telefono: '555-1002', direccion: 'Industrial Zone 5', ruc: '20987654321', estado: 'Activo' },
      { nombre: 'Global', apellido: 'Imports', correo: 'info@globalimports.com', telefono: '555-1003', direccion: 'Av. Marina 200', ruc: '20556677889', estado: 'Activo' },
    ]);
    console.log('Providers created.');

    // --- Employees ---
    const employees = await Employee.bulkCreate([
      { nombre: 'Pedro', apellido: 'Gomez', correo: 'pedro@company.com', telefono: '555-2001', direccion: 'Main St 101' },
      { nombre: 'Lucia', apellido: 'Diaz', correo: 'lucia@company.com', telefono: '555-2002', direccion: 'Side St 202' },
      { nombre: 'Jorge', apellido: 'Ramirez', correo: 'jorge@company.com', telefono: '555-2003', direccion: 'Central Ave 505' },
    ]);
    console.log('Employees created.');

    // --- Transporters ---
    const transporters = await Transporter.bulkCreate([
      { ruc: '20100100200', nombre: 'Transportes', apellido: 'Rapidos', placa: 'ABC-123' },
      { ruc: '20200200300', nombre: 'Logistica', apellido: 'Segura', placa: 'XYZ-987' },
    ]);
    console.log('Transporters created.');

    // --- Guides (Ingreso) ---
    // Employee: Pedro Gomez
    const entryGuide1 = await Guide.create({
      empleado: employees[0].nombre + ' ' + employees[0].apellido,
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'Ingreso'
    });

    await EntryGuide.create({
      guiaId: entryGuide1.id,
      proveedor: providers[0].nombre + ' ' + providers[0].apellido // Tech Supplier
    });

    await GuideDetail.bulkCreate([
      { guiaId: entryGuide1.id, producto: products[0].nombre, cantidad: 10 }, // 10 Galaxy S24
      { guiaId: entryGuide1.id, producto: products[2].nombre, cantidad: 5 },  // 5 PS5
    ]);
    console.log('Entry Guide 1 created.');

    // --- Guides (Salida) ---
    // Employee: Lucia Diaz
    const exitGuide1 = await Guide.create({
      empleado: employees[1].nombre + ' ' + employees[1].apellido,
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'Salida'
    });

    await ExitGuide.create({
      guiaId: exitGuide1.id,
      cliente: clients[0].nombre + ' ' + clients[0].apellido, // Juan Perez
      transportista: transporters[0].nombre + ' ' + transporters[0].apellido, // Transportes Rapidos
      puertoPartida: 'Almacen Central',
      puertoLlegada: clients[0].direccion
    });

    await GuideDetail.bulkCreate([
      { guiaId: exitGuide1.id, producto: products[0].nombre, cantidad: 1 }, // 1 Galaxy S24
    ]);
    console.log('Exit Guide 1 created.');

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
