/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Transaction } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { exportToExcel } from '../lib/excel';

interface HistoryTableProps {
  transactions: Transaction[];
}

export default function HistoryTable({ transactions }: HistoryTableProps) {
  const handleExport = () => {
    const exportData = transactions.map(t => ({
      '操作时间': format(new Date(t.date), 'yyyy-MM-dd HH:mm', { locale: zhCN }),
      '操作类型': t.type === 'INBOUND' ? '入库' : '出库',
      '产品名称': t.productName,
      '数量': t.type === 'INBOUND' ? t.quantity : -t.quantity,
      '操作员': t.operator,
      '备注': t.note || ''
    }));
    exportToExcel(exportData, '出入库记录', '记录');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={handleExport} 
          className="border-gray-200 text-gray-600 hover:bg-gray-50 gap-2 rounded-xl"
        >
          <Download size={18} /> 导出 Excel
        </Button>
      </div>
      <Card className="border-none shadow-sm bg-white overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-gray-100">
              <TableHead className="pl-6 font-bold text-gray-900">时间</TableHead>
              <TableHead className="font-bold text-gray-900">类型</TableHead>
              <TableHead className="font-bold text-gray-900">产品</TableHead>
              <TableHead className="text-right font-bold text-gray-900">数量</TableHead>
              <TableHead className="text-right font-bold text-gray-900">金额</TableHead>
              <TableHead className="text-right font-bold text-gray-900">利润</TableHead>
              <TableHead className="pr-6 font-bold text-gray-900 text-right">操作员</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                <TableCell className="pl-6 text-gray-500 text-sm">
                  {format(new Date(t.date), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                </TableCell>
                <TableCell>
                  {t.type === 'INBOUND' ? (
                    <Badge className="bg-emerald-50 text-emerald-600 border-none shadow-none font-bold">入库</Badge>
                  ) : (
                    <Badge className="bg-indigo-50 text-indigo-600 border-none shadow-none font-bold">出库</Badge>
                  )}
                </TableCell>
                <TableCell className="font-bold text-gray-900">{t.productName}</TableCell>
                <TableCell className="text-right font-bold">
                  {t.type === 'INBOUND' ? '+' : '-'}{t.quantity}
                </TableCell>
                <TableCell className="text-right font-medium text-gray-600">
                  ¥{(t.totalAmount || 0).toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-bold text-indigo-600">
                  {t.profit && t.profit > 0 ? `+¥${t.profit.toLocaleString()}` : '-'}
                </TableCell>
                <TableCell className="text-right pr-6 font-medium text-gray-600">{t.operator}</TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-gray-400">
                  暂无记录
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </div>
  );
}
