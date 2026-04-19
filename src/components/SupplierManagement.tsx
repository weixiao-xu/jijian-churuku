/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Supplier } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { Plus, Search, Truck, Edit2, Trash2, Phone, MapPin, User, AlertTriangle } from 'lucide-react';
import SupplierDialog from './SupplierDialog';

interface SupplierManagementProps {
  suppliers: Supplier[];
  onAdd: (supplier: Omit<Supplier, 'id'>) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
}

export default function SupplierManagement({ suppliers, onAdd, onEdit, onDelete }: SupplierManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
    } else {
      setEditingSupplier(null);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: Omit<Supplier, 'id'> | Supplier) => {
    if ('id' in data) {
      onEdit(data as Supplier);
    } else {
      onAdd(data);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="搜索供应商名称或联系人..." 
            className="pl-10 h-11 rounded-xl border-gray-100 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-6 gap-2 font-bold shadow-lg shadow-indigo-100"
        >
          <Plus size={18} /> 新增供应商
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-gray-50 hover:bg-transparent">
              <TableHead className="pl-6 font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">供应商名称</TableHead>
              <TableHead className="font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">联系人</TableHead>
              <TableHead className="font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">联系电话</TableHead>
              <TableHead className="font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">地址</TableHead>
              <TableHead className="font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">结算方式</TableHead>
              <TableHead className="text-right pr-6 font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.map((supplier) => {
              const isConfirming = confirmDeleteId === supplier.id;
              
              return (
                <TableRow key={supplier.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500">
                        <Truck size={20} />
                      </div>
                      <span className="font-bold text-gray-900">{supplier.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User size={14} className="text-gray-400" />
                      {supplier.contact}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={14} className="text-gray-400" />
                      {supplier.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-600 text-sm max-w-[200px] truncate">
                      <MapPin size={14} className="text-gray-400 shrink-0" />
                      {supplier.address}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold uppercase">
                      {supplier.paymentMethod}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-1 items-center">
                      {!isConfirming ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                            onClick={() => handleOpenDialog(supplier)}
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            onClick={() => setConfirmDeleteId(supplier.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                          <Button 
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-xs font-bold text-gray-400 hover:text-gray-900 hover:bg-transparent"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            取消
                          </Button>
                          <Button 
                            size="sm" 
                            className="h-8 px-4 text-xs bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold shadow-sm"
                            onClick={() => {
                              onDelete(supplier.id);
                              setConfirmDeleteId(null);
                            }}
                          >
                            确认删除
                          </Button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <SupplierDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingSupplier}
      />
    </div>
  );
}
