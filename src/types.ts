/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  unitId: string;
  currentStock: number;
  minStock: number;
  purchasePrice: number;
  sellingPrice: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  address: string;
  paymentMethod: string;
  note?: string;
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
  phone: string;
  address: string;
  type: string;
  accountPeriod?: string;
  debt: number;
}

export interface Location {
  id: string;
  warehouseName: string;
  area: string;
  shelf: string;
  code: string;
}

export interface Document {
  id: string;
  billNo: string;
  type: 'INBOUND' | 'OUTBOUND';
  date: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  supplierId?: string;
  customerId?: string;
  locationId: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED';
  maker: string;
  approver?: string;
  note?: string;
}

export interface Transaction extends Document {
  // Maintaining compatibility with existing logic for now
  operator: string;
  profit: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface Unit {
  id: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  password?: string;
  role: 'ADMIN' | 'OPERATOR' | 'FINANCE' | 'VIEWER';
  department?: string;
  phone?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface ChatMessage {
  id: string;
  fromId: string;
  toId: string;
  content: string;
  timestamp: number;
}

export interface OnlineUser {
  id: string;
  name: string;
  username: string;
}

export interface SystemSettings {
  categories: Category[];
  units: Unit[];
  warehouses: { id: string; name: string }[];
  alertThreshold: number;
}
