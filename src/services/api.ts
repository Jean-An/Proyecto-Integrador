import type { User, Category, Product, Cliente, Brand, Provider, Transportista, Empleado, Guia, DetalleGuia, GuiaIngreso, GuiaSalida } from '../types';

const API_URL = 'http://localhost:3000/api';

export const api = {
  getUsers: async (): Promise<User[]> => {
    // Backend does not expose users list yet
    return [];
  },
  getCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },
  getBrands: async (): Promise<Brand[]> => {
    const response = await fetch(`${API_URL}/brands`);
    if (!response.ok) throw new Error('Failed to fetch brands');
    return response.json();
  },
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },
  getClients: async (): Promise<Cliente[]> => {
    const response = await fetch(`${API_URL}/clients`);
    if (!response.ok) throw new Error('Failed to fetch clients');
    return response.json();
  },
  getProviders: async (): Promise<Provider[]> => {
    const response = await fetch(`${API_URL}/providers`);
    if (!response.ok) throw new Error('Failed to fetch providers');
    return response.json();
  },
  getEmployees: async (): Promise<Empleado[]> => {
    const response = await fetch(`${API_URL}/employees`);
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json();
  },
  getTransporters: async (): Promise<Transportista[]> => {
    const response = await fetch(`${API_URL}/transporters`);
    if (!response.ok) throw new Error('Failed to fetch transporters');
    return response.json();
  },
  getGuides: async (): Promise<Guia[]> => {
    const response = await fetch(`${API_URL}/guides`);
    if (!response.ok) throw new Error('Failed to fetch guides');
    return response.json();
  },
  getGuideDetails: async (): Promise<DetalleGuia[]> => {
    const response = await fetch(`${API_URL}/guide-details`);
    if (!response.ok) throw new Error('Failed to fetch guide details');
    return response.json();
  },
  getEntryGuides: async (): Promise<GuiaIngreso[]> => {
    const response = await fetch(`${API_URL}/entry-guides`);
    if (!response.ok) throw new Error('Failed to fetch entry guides');
    return response.json();
  },
  getExitGuides: async (): Promise<GuiaSalida[]> => {
    const response = await fetch(`${API_URL}/exit-guides`);
    if (!response.ok) throw new Error('Failed to fetch exit guides');
    return response.json();
  },
};
