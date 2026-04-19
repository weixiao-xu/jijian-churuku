/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product, Transaction } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { TrendingUp, Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface FinancialStatsProps {
  products: Product[];
  transactions: Transaction[];
}

export default function FinancialStats({ products, transactions }: FinancialStatsProps) {
  // Calculate stats per product
  const productPerformance = products.map(product => {
    const productTransactions = transactions.filter(t => t.productId === product.id);
    const totalInbound = productTransactions
      .filter(t => t.type === 'INBOUND')
      .reduce((acc, t) => acc + t.quantity, 0);
    const totalOutbound = productTransactions
      .filter(t => t.type === 'OUTBOUND')
      .reduce((acc, t) => acc + t.quantity, 0);
    const totalRevenue = productTransactions
      .filter(t => t.type === 'OUTBOUND')
      .reduce((acc, t) => acc + t.totalAmount, 0);
    const totalCost = productTransactions
      .filter(t => t.type === 'OUTBOUND')
      .reduce((acc, t) => acc + (t.quantity * (product.purchasePrice || 0)), 0);
    const totalProfit = totalRevenue - totalCost;

    return {
      ...product,
      purchasePrice: product.purchasePrice || 0,
      sellingPrice: product.sellingPrice || 0,
      totalInbound,
      totalOutbound,
      totalRevenue,
      totalProfit,
      margin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
    };
  }).sort((a, b) => (b.totalProfit || 0) - (a.totalProfit || 0));

  const overallProfit = productPerformance.reduce((acc, p) => acc + (p.totalProfit || 0), 0);
  const overallRevenue = productPerformance.reduce((acc, p) => acc + (p.totalRevenue || 0), 0);
  const overallCost = overallRevenue - overallProfit;

  return (
    <div className="space-y-8">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="累计总营收" 
          value={`¥${(overallRevenue || 0).toLocaleString()}`} 
          icon={<Wallet className="text-emerald-500" size={20} />}
          color="emerald"
        />
        <SummaryCard 
          title="累计总成本" 
          value={`¥${(overallCost || 0).toLocaleString()}`} 
          icon={<ArrowDownCircle className="text-rose-500" size={20} />}
          color="rose"
        />
        <SummaryCard 
          title="累计总净利" 
          value={`¥${(overallProfit || 0).toLocaleString()}`} 
          icon={<TrendingUp className="text-indigo-500" size={20} />}
          color="indigo"
          subtitle={`毛利率: ${overallRevenue > 0 ? (((overallProfit || 0) / overallRevenue) * 100).toFixed(1) : 0}%`}
        />
      </div>

      {/* Product Profitability Table */}
      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
        <CardHeader className="border-b border-gray-50 pb-4 px-6 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <div className="w-1 h-6 bg-indigo-500 rounded-full" />
            产品盈利排行
          </CardTitle>
          <Badge className="bg-indigo-50 text-indigo-600 border-none font-bold">
            按净利润排序
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent border-gray-100">
                <TableHead className="pl-6 font-bold text-gray-900">产品信息</TableHead>
                <TableHead className="text-right font-bold text-gray-900">单件利润</TableHead>
                <TableHead className="text-right font-bold text-gray-900">销售总量</TableHead>
                <TableHead className="text-right font-bold text-gray-900">总营收</TableHead>
                <TableHead className="text-right font-bold text-gray-900">总净利</TableHead>
                <TableHead className="text-center font-bold text-gray-900 pr-6">利润率</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productPerformance.map((p) => (
                <TableRow key={p.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <TableCell className="pl-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{p.name}</span>
                      <span className="text-xs text-gray-400 font-mono">{p.sku}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-gray-600">
                    ¥{((p.sellingPrice || 0) - (p.purchasePrice || 0)).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-bold text-gray-900">
                    {p.totalOutbound} <span className="text-xs font-normal text-gray-400">{p.unitId}</span>
                  </TableCell>
                  <TableCell className="text-right font-medium text-emerald-600">
                    ¥{(p.totalRevenue || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-bold text-indigo-600">
                    ¥{(p.totalProfit || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center pr-6">
                    <Badge className={p.margin > 20 ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"}>
                      {p.margin.toFixed(1)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ title, value, icon, color, subtitle }: { 
  title: string, 
  value: string, 
  icon: React.ReactNode, 
  color: string,
  subtitle?: string
}) {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-50',
    rose: 'bg-rose-50',
    emerald: 'bg-emerald-50',
    amber: 'bg-amber-50',
  };

  return (
    <Card className="border-none shadow-sm bg-white rounded-2xl">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
          <div className={`p-2.5 ${colorMap[color]} rounded-xl`}>
            {icon}
          </div>
        </div>
        <h3 className="text-3xl font-black tracking-tight text-gray-900">{value}</h3>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-2 font-bold">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
