import { db } from './db';
import { api } from './api';

export const syncDatabase = async () => {
  try {
    console.log('Starting synchronization...');

    // Fetch data from API
    // We use Promise.allSettled to ensure that one failure doesn't stop others
    const results = await Promise.allSettled([
      api.getCategories(),
      api.getBrands(),
      api.getProducts(),
      api.getClients(),
      api.getProviders(),
      api.getEmployees(),
      api.getTransporters(),
      api.getGuides(),
      api.getGuideDetails(),
      api.getEntryGuides(),
      api.getExitGuides()
    ]);

    const [
      categoriesResult,
      brandsResult,
      productsResult,
      clientsResult,
      providersResult,
      employeesResult,
      transportersResult,
      guidesResult,
      guideDetailsResult,
      entryGuidesResult,
      exitGuidesResult
    ] = results;

    // Transaction to update Dexie
    await db.transaction('rw', [
            db.categorias, 
            db.marcas,
            db.productos, 
            db.clientes, 
            db.proveedores, 
            db.empleados, 
            db.transportistas,
            db.guias,
            db.detallesGuia,
            db.guiasIngreso,
            db.guiasSalida
        ], async () => {
        if (categoriesResult.status === 'fulfilled') {
            await db.categorias.clear();
            await db.categorias.bulkPut(categoriesResult.value);
            console.log(`Synced ${categoriesResult.value.length} categories`);
        }

        if (brandsResult.status === 'fulfilled') {
            await db.marcas.clear();
            await db.marcas.bulkPut(brandsResult.value);
            console.log(`Synced ${brandsResult.value.length} brands`);
        }
        
        if (productsResult.status === 'fulfilled') {
            await db.productos.clear();
            await db.productos.bulkPut(productsResult.value);
            console.log(`Synced ${productsResult.value.length} products`);
        }

        if (clientsResult.status === 'fulfilled') {
            await db.clientes.clear();
            await db.clientes.bulkPut(clientsResult.value);
            console.log(`Synced ${clientsResult.value.length} clients`);
        }

        if (providersResult.status === 'fulfilled') {
            await db.proveedores.clear();
            await db.proveedores.bulkPut(providersResult.value);
            console.log(`Synced ${providersResult.value.length} providers`);
        }

        if (employeesResult.status === 'fulfilled') {
            await db.empleados.clear();
            await db.empleados.bulkPut(employeesResult.value);
            console.log(`Synced ${employeesResult.value.length} employees`);
        }
        
        if (transportersResult.status === 'fulfilled') {
            await db.transportistas.clear();
            await db.transportistas.bulkPut(transportersResult.value);
             console.log(`Synced ${transportersResult.value.length} transporters`);
        }

        if (guidesResult.status === 'fulfilled') {
            await db.guias.clear();
            await db.guias.bulkPut(guidesResult.value);
            console.log(`Synced ${guidesResult.value.length} guides`);
        }

        if (guideDetailsResult.status === 'fulfilled') {
            await db.detallesGuia.clear();
            await db.detallesGuia.bulkPut(guideDetailsResult.value);
            console.log(`Synced ${guideDetailsResult.value.length} guide details`);
        }

        if (entryGuidesResult.status === 'fulfilled') {
            await db.guiasIngreso.clear();
            await db.guiasIngreso.bulkPut(entryGuidesResult.value);
            console.log(`Synced ${entryGuidesResult.value.length} entry guides`);
        }

        if (exitGuidesResult.status === 'fulfilled') {
            await db.guiasSalida.clear();
            await db.guiasSalida.bulkPut(exitGuidesResult.value);
            console.log(`Synced ${exitGuidesResult.value.length} exit guides`);
        }
    });

    console.log('Synchronization completed successfully.');
  } catch (error) {
    console.error('Synchronization failed:', error);
  }
};
