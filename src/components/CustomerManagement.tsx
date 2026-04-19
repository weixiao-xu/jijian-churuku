/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Customer } from '../types';
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
import { Badge } from './ui/badge';
import { Plus, Search, Users, Edit2, Trash2, Phone, MapPin, User, CreditCard, AlertTriangle } from 'lucide-react';
import CustomerDialog from './CustomerDialog';

interface CustomerManagementProps {
  customers: Customer[];
  onAdd: (customer: Omit<Customer, 'id' | 'debt'>) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export default function CustomerManagement({ customers, onAdd, onEdit, onDelete }: CustomerManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
    } else {
      setEditingCustomer(null);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: Omit<Customer, 'id' | 'debt'> | Customer) => {
    if ('id' in data) {
      onEdit(data as Customer);
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
            placeholder="搜索客户名称或联系人..." 
            className="pl-10 h-11 rounded-xl border-gray-100 focus:ring-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 gap-2 font-bold shadow-lg shadow-emerald-100"
        >
          <Plus size={18} /> 新增客户
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-gray-50 hover:bg-transparent">
              <TableHead className="pl-6 font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">客户名称</TableHead>
              <TableHead className="font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">类型</TableHead>
              <TableHead className="font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">联系信息</TableHead>
              <TableHead className="font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">地址</TableHead>
              <TableHead className="font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">财务状况</TableHead>
              <TableHead className="text-right pr-6 font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => {
              const isConfirming = confirmDeleteId === customer.id;
              
              return (
                <TableRow key={customer.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500">
                        <Users size={20} />
                      </div>
                      <span className="font-bold text-gray-900">{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase border-emerald-100 text-emerald-600 bg-emerald-50/30">
                      {customer.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <User size={12} className="text-gray-400" />
                        {customer.contact}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <Phone size={12} />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-600 text-sm max-w-[200px] truncate">
                      <MapPin size={14} className="text-gray-400 shrink-0" />
                      {customer.address}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400 tracking-tight">
                        <CreditCard size={12} />
                        欠款: <span className={(customer.debt || 0) > 0 ? 'text-rose-500 font-black' : 'text-emerald-500'}>
                          ¥{(customer.debt || 0).toLocaleString()}
                        </span>
                      </div>
                      {customer.accountPeriod && (
                        <span className="text-[10px] text-gray-400">账期: {customer.accountPeriod}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-1 items-center">
                      {!isConfirming ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                            onClick={() => handleOpenDialog(customer)}
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            onClick={() => setConfirmDeleteId(customer.id)}
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
                              onDelete(customer.id);
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

      <CustomerDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingCustomer}
      />
    </div>
  );
}
