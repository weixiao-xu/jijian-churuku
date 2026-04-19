/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Transaction } from '../types';
import { Card, CardContent } from './ui/card';
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
import { 
  Plus, 
  Search, 
  FileText, 
  CheckCircle2, 
  Clock, 
  User, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  Printer
} from 'lucide-react';

interface DocumentManagementProps {
  transactions: Transaction[];
  onAudit: (id: string) => void;
  onPrint: (transaction: Transaction) => void;
}

export default function DocumentManagement({ transactions, onAudit, onPrint }: DocumentManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocs = transactions.filter(t => 
    t.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="搜索单据编号或产品..." 
              className="pl-10 h-11 rounded-xl border-gray-100 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-gray-200 h-11 rounded-xl px-4 text-gray-600 gap-2 font-bold">
            <Filter size={18} /> 筛选
          </Button>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-200 h-11 rounded-xl px-4 text-gray-600 gap-2 font-bold">
            <Download size={18} /> 导出
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-gray-50 hover:bg-transparent">
              <TableHead className="pl-6 font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">单据编号/时间</TableHead>
              <TableHead className="font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">类型/产品</TableHead>
              <TableHead className="font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">业务数量</TableHead>
              <TableHead className="font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">金额/利润</TableHead>
              <TableHead className="font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">状态/制单人</TableHead>
              <TableHead className="text-right pr-6 font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocs.map((doc) => (
              <TableRow key={doc.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                <TableCell className="pl-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-xs font-black text-indigo-600">#{doc.id.toUpperCase()}</span>
                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold">
                      <Clock size={12} />
                      {new Date(doc.date).toLocaleString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      doc.type === 'INBOUND' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {doc.type === 'INBOUND' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{doc.productName}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                        {doc.type === 'INBOUND' ? '入库登记' : '出库登记'}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-black text-gray-900">{doc.quantity.toLocaleString()}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">¥{doc.totalAmount.toLocaleString()}</span>
                    {doc.type === 'OUTBOUND' && (
                      <span className="text-[10px] text-emerald-500 font-bold">利润: +¥{doc.profit.toLocaleString()}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-50 text-emerald-600 border-none shadow-none text-[10px] font-black uppercase">
                        已审核
                      </Badge>
                      <Badge className="bg-gray-50 text-gray-400 border-none shadow-none text-[10px] font-black uppercase">
                        已完成
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold">
                      <User size={12} />
                      制单人: {doc.operator}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onPrint(doc)}
                      className="h-8 w-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    >
                      <Printer size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
