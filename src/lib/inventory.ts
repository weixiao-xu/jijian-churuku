/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Product, 
  Transaction, 
  Supplier, 
  Customer, 
  Location, 
  Category, 
  Unit, 
  SystemSettings 
} from '../types';

const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', name: '电子产品' },
  { id: 'c2', name: '外设' },
  { id: 'c3', name: '显示器' },
];

const INITIAL_UNITS: Unit[] = [
  { id: 'u1', name: '台' },
  { id: 'u2', name: '个' },
  { id: 'u3', name: '把' },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'MacBook Pro 14', sku: 'MBP-14-M3', categoryId: 'c1', currentStock: 15, minStock: 5, unitId: 'u1', purchasePrice: 12000, sellingPrice: 15000 },
  { id: '2', name: 'iPhone 15 Pro', sku: 'IP-15-PRO', categoryId: 'c1', currentStock: 25, minStock: 10, unitId: 'u1', purchasePrice: 7000, sellingPrice: 8999 },
];

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'Apple 官方分销', contact: '张总', phone: '13800138000', address: '上海市浦东新区', paymentMethod: '月结' },
  { id: 's2', name: '罗技授权商', contact: '王经理', phone: '13900139000', address: '北京市海淀区', paymentMethod: '现结' },
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'cus1', name: '阿里巴巴集团', contact: '李经理', phone: '13700137000', address: '杭州市西湖区', type: '企业客户', debt: 0 },
  { id: 'cus2', name: '个人摄影师', contact: '陈先生', phone: '13600136000', address: '广州市天河区', type: '个人客户', debt: 500 },
];

const INITIAL_LOCATIONS: Location[] = [
  { id: 'l1', warehouseName: '一号主仓', area: 'A区', shelf: '01', code: 'A-01-01' },
  { id: 'l2', warehouseName: '二号副仓', area: 'B区', shelf: '05', code: 'B-05-12' },
];

const INITIAL_SETTINGS: SystemSettings = {
  categories: INITIAL_CATEGORIES,
  units: INITIAL_UNITS,
  warehouses: [{ id: 'w1', name: '一号主仓' }, { id: 'w2', name: '二号副仓' }],
  alertThreshold: 10,
};

export const getStoredData = () => {
  const get = (key: string, initial: any) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : initial;
  };
  
  return {
    products: get('inventory_products', INITIAL_PRODUCTS),
    transactions: get('inventory_transactions', []),
    suppliers: get('inventory_suppliers', INITIAL_SUPPLIERS),
    customers: get('inventory_customers', INITIAL_CUSTOMERS),
    locations: get('inventory_locations', INITIAL_LOCATIONS),
    settings: get('inventory_settings', INITIAL_SETTINGS),
  };
};

export const saveCollection = (key: string, data: any) => {
  localStorage.setItem(`inventory_${key}`, JSON.stringify(data));
};

export const saveProducts = (data: Product[]) => saveCollection('products', data);
export const saveTransactions = (data: Transaction[]) => saveCollection('transactions', data);
export const saveSuppliers = (data: Supplier[]) => saveCollection('suppliers', data);
export const saveCustomers = (data: Customer[]) => saveCollection('customers', data);
export const saveLocations = (data: Location[]) => saveCollection('locations', data);
export const saveSettings = (data: SystemSettings) => saveCollection('settings', data);
