/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
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

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id' | 'currentStock'> | Product) => void;
  initialData?: Product | null;
}

export default function ProductDialog({ isOpen, onClose, onSubmit, initialData }: ProductDialogProps) {
  const [name, setName] = React.useState('');
  const [sku, setSku] = React.useState('');
  const [categoryId, setCategoryId] = React.useState('');
  const [minStock, setMinStock] = React.useState('5');
  const [unitId, setUnitId] = React.useState('个');
  const [purchasePrice, setPurchasePrice] = React.useState('0');
  const [sellingPrice, setSellingPrice] = React.useState('0');

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setSku(initialData.sku || '');
      setCategoryId(initialData.categoryId || '');
      setMinStock((initialData.minStock ?? 5).toString());
      setUnitId(initialData.unitId || '个');
      setPurchasePrice((initialData.purchasePrice ?? 0).toString());
      setSellingPrice((initialData.sellingPrice ?? 0).toString());
    } else {
      setName('');
      setSku('');
      setCategoryId('');
      setMinStock('5');
      setUnitId('个');
      setPurchasePrice('0');
      setSellingPrice('0');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || !categoryId) return;
    
    const productData = {
      name,
      sku,
      categoryId,
      minStock: parseInt(minStock),
      unitId,
      purchasePrice: parseFloat(purchasePrice),
      sellingPrice: parseFloat(sellingPrice),
    };

    if (initialData) {
      onSubmit({ ...initialData, ...productData });
    } else {
      onSubmit(productData);
    }

    // Reset form
    setName('');
    setSku('');
    setCategoryId('');
    setMinStock('5');
    setUnitId('个');
    setPurchasePrice('0');
    setSellingPrice('0');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-white rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 border-b border-gray-50 pb-4">
            {initialData ? '编辑产品' : '新增产品'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-bold text-gray-500 uppercase tracking-wider">产品名称</Label>
              <Input
                id="name"
                placeholder="例如：MacBook Pro"
                className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="sku" className="text-xs font-bold text-gray-500 uppercase tracking-wider">SKU / 编号</Label>
                <Input
                  id="sku"
                  placeholder="例如：MBP-001"
                  className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="category" className="text-xs font-bold text-gray-500 uppercase tracking-wider">分类</Label>
                <Input
                  id="category"
                  placeholder="例如：电子产品"
                  className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="purchasePrice" className="text-xs font-bold text-gray-500 uppercase tracking-wider">入库单价 (成本)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="0.01"
                  className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sellingPrice" className="text-xs font-bold text-gray-500 uppercase tracking-wider">出库单价 (售价)</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  step="0.01"
                  className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="minStock" className="text-xs font-bold text-gray-500 uppercase tracking-wider">安全库存</Label>
                <Input
                  id="minStock"
                  type="number"
                  className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500"
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="unit" className="text-xs font-bold text-gray-500 uppercase tracking-wider">单位</Label>
                <Input
                  id="unit"
                  placeholder="个/台/件"
                  className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500"
                  value={unitId}
                  onChange={(e) => setUnitId(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-white border-t border-gray-50 m-0 rounded-none">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl h-11 px-6 font-bold text-gray-400">
              取消
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-8 font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95">
              {initialData ? '保存修改' : '确认添加'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
