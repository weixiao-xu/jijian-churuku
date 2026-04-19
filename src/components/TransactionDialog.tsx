/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product, Supplier, Customer, Location } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface TransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'INBOUND' | 'OUTBOUND';
  products: Product[];
  suppliers: Supplier[];
  customers: Customer[];
  locations: Location[];
  onSubmit: (data: {
    productId: string;
    type: 'INBOUND' | 'OUTBOUND';
    quantity: number;
    operator: string;
    note?: string;
    supplierId?: string;
    customerId?: string;
    locationId: string;
  }) => void;
}

export default function TransactionDialog({ 
  isOpen, 
  onClose, 
  type, 
  products, 
  suppliers,
  customers,
  locations,
  onSubmit 
}: TransactionDialogProps) {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [operator, setOperator] = useState('');
  const [note, setNote] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [locationId, setLocationId] = useState('');

  const selectedProduct = products.find(p => p.id === productId);
  const selectedSupplier = suppliers.find(s => s.id === supplierId);
  const selectedCustomer = customers.find(c => c.id === customerId);
  const selectedLocation = locations.find(l => l.id === locationId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !quantity || !operator || !locationId) return;
    
    onSubmit({
      productId,
      type,
      quantity: parseInt(quantity),
      operator,
      note,
      supplierId: type === 'INBOUND' ? supplierId : undefined,
      customerId: type === 'OUTBOUND' ? customerId : undefined,
      locationId
    });

    // Reset form
    setProductId('');
    setQuantity('');
    setOperator('');
    setNote('');
    setSupplierId('');
    setCustomerId('');
    setLocationId('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 border-b border-gray-50 pb-4">
            {type === 'INBOUND' ? '产品入库登记' : '产品出库登记'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="product" className="text-xs font-bold text-gray-500 uppercase tracking-wider">选择产品</Label>
                <Select onValueChange={setProductId} value={productId}>
                  <SelectTrigger className="w-full bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500">
                    <SelectValue placeholder="选择产品">
                      {selectedProduct?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-100 rounded-xl">
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="quantity" className="text-xs font-bold text-gray-500 uppercase tracking-wider">业务数量</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="数量"
                  className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {type === 'INBOUND' ? '供应商' : '客户'}
                </Label>
                {type === 'INBOUND' ? (
                  <Select onValueChange={setSupplierId} value={supplierId}>
                    <SelectTrigger className="w-full bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500">
                      <SelectValue placeholder="选择供应商">
                        {selectedSupplier?.name}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-100 rounded-xl">
                      {suppliers.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Select onValueChange={setCustomerId} value={customerId}>
                    <SelectTrigger className="w-full bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500">
                      <SelectValue placeholder="选择客户">
                        {selectedCustomer?.name}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-100 rounded-xl">
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">存入/取出仓位</Label>
                <Select onValueChange={setLocationId} value={locationId}>
                  <SelectTrigger className="w-full bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500">
                    <SelectValue placeholder="选择仓位">
                      {selectedLocation ? `${selectedLocation.warehouseName} - ${selectedLocation.code}` : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-100 rounded-xl">
                    {locations.map((l) => (
                      <SelectItem key={l.id} value={l.id}>{l.warehouseName} - {l.code}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="operator" className="text-xs font-bold text-gray-500 uppercase tracking-wider">经办人</Label>
              <Input
                id="operator"
                placeholder="请输入经办人姓名"
                className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="note" className="text-xs font-bold text-gray-500 uppercase tracking-wider">备注说明</Label>
              <Input
                id="note"
                placeholder="添加补充信息"
                className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="p-6 bg-white border-t border-gray-50 m-0 rounded-none">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl h-11 px-6 font-bold text-gray-400">
              放弃
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-10 font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95">
              确认提交单据
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
