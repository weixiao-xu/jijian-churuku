/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Supplier } from '../types';
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

interface SupplierDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (supplier: Omit<Supplier, 'id'> | Supplier) => void;
  initialData?: Supplier | null;
}

export default function SupplierDialog({ isOpen, onClose, onSubmit, initialData }: SupplierDialogProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setContact(initialData.contact || '');
      setPhone(initialData.phone || '');
      setAddress(initialData.address || '');
      setPaymentMethod(initialData.paymentMethod || '');
      setNote(initialData.note || '');
    } else {
      setName('');
      setContact('');
      setPhone('');
      setAddress('');
      setPaymentMethod('');
      setNote('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) return;
    
    const supplierData = {
      name,
      contact,
      phone,
      address,
      paymentMethod,
      note,
    };

    if (initialData) {
      onSubmit({ ...initialData, ...supplierData });
    } else {
      onSubmit(supplierData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-white rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 border-b border-gray-50 pb-4">
            {initialData ? '编辑供应商' : '新增供应商'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-bold text-gray-500 uppercase tracking-wider">供应商名称</Label>
              <Input
                id="name"
                placeholder="请输入供应商全称"
                className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="contact" className="text-xs font-bold text-gray-500 uppercase tracking-wider">联系人</Label>
                <Input
                  id="contact"
                  placeholder="姓名"
                  className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone" className="text-xs font-bold text-gray-500 uppercase tracking-wider">联系电话</Label>
                <Input
                  id="phone"
                  placeholder="电话号码"
                  className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="address" className="text-xs font-bold text-gray-500 uppercase tracking-wider">详细地址</Label>
              <Input
                id="address"
                placeholder="请输入供应商详细地址"
                className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="paymentMethod" className="text-xs font-bold text-gray-500 uppercase tracking-wider">结算方式</Label>
              <Input
                id="paymentMethod"
                placeholder="例如：现结、月结、账期30天"
                className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="note" className="text-xs font-bold text-gray-500 uppercase tracking-wider">备注</Label>
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
