/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Customer } from '../types';
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

interface CustomerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customer: Omit<Customer, 'id' | 'debt'> | Customer) => void;
  initialData?: Customer | null;
}

export default function CustomerDialog({ isOpen, onClose, onSubmit, initialData }: CustomerDialogProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState('普通客户');
  const [debt, setDebt] = useState('0');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setContact(initialData.contact || '');
      setPhone(initialData.phone || '');
      setAddress(initialData.address || '');
      setType(initialData.type || '普通客户');
      setDebt((initialData.debt ?? 0).toString());
    } else {
      setName('');
      setContact('');
      setPhone('');
      setAddress('');
      setType('普通客户');
      setDebt('0');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) return;
    
    const customerData = {
      name,
      contact,
      phone,
      address,
      type,
      debt: parseFloat(debt),
    };

    if (initialData) {
      onSubmit({ ...initialData, ...customerData });
    } else {
      onSubmit(customerData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-white rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 border-b border-gray-50 pb-4">
            {initialData ? '编辑客户' : '新增客户'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-bold text-gray-500 uppercase tracking-wider">客户名称</Label>
              <Input
                id="name"
                placeholder="请输入单位名称或姓名"
                className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-emerald-500"
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
                  className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-emerald-500"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone" className="text-xs font-bold text-gray-500 uppercase tracking-wider">联系电话</Label>
                <Input
                  id="phone"
                  placeholder="联系方式"
                  className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-emerald-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="address" className="text-xs font-bold text-gray-500 uppercase tracking-wider">地址信息</Label>
              <Input
                id="address"
                placeholder="送货地址"
                className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-emerald-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="type" className="text-xs font-bold text-gray-500 uppercase tracking-wider">客户类型</Label>
                <Input
                  id="type"
                  placeholder="例如：VIP、经销商"
                  className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-emerald-500"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="debt" className="text-xs font-bold text-gray-500 uppercase tracking-wider">当前欠款/账期</Label>
                <Input
                  id="debt"
                  type="number"
                  placeholder="0.00"
                  className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-emerald-500"
                  value={debt}
                  onChange={(e) => setDebt(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-white border-t border-gray-50 m-0 rounded-none">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl h-11 px-6 font-bold text-gray-400">
              取消
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-8 font-bold shadow-lg shadow-emerald-100 transition-all active:scale-95">
              {initialData ? '保存修改' : '确认添加'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
