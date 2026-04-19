/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Product, Transaction } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  Line
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Package, AlertCircle, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';

interface DashboardProps {
  products: Product[];
  transactions: Transaction[];
}

// Vibrant, modern color palette
const COLORS = [
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#8B5CF6', // Violet
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#06B6D4', // Cyan
];

export default function Dashboard({ products, transactions }: DashboardProps) {
  const totalStock = products.reduce((acc, p) => acc + p.currentStock, 0);
  const lowStockCount = products.filter(p => p.currentStock <= p.minStock).length;
  
  const totalProfit = transactions.reduce((acc, t) => acc + (t.profit || 0), 0);
    
  const recentOutbound = transactions
    .filter(t => t.type === 'OUTBOUND')
    .slice(0, 10)
    .reduce((acc, t) => acc + t.quantity, 0);

  // Data for Category Pie Chart
  const categoryData = products.reduce((acc: any[], p) => {
    const existing = acc.find(item => item.name === p.categoryId);
    if (existing) {
      existing.value += p.currentStock;
    } else {
      acc.push({ name: p.categoryId, value: p.currentStock });
    }
    return acc;
  }, []);

  // Data for Stock Levels Bar Chart
  const stockData = products.slice(0, 8).map((p, index) => ({
    name: p.name,
    stock: p.currentStock,
    profit: transactions
      .filter(t => t.productId === p.id)
      .reduce((acc, t) => acc + (t.profit || 0), 0),
    fill: COLORS[index % COLORS.length]
  }));

  // Data for Daily Activity (AreaChart)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const dailyTrend = last7Days.map(date => {
    const dayTransactions = transactions.filter(t => t.date.startsWith(date));
    return {
      date: date.split('-').slice(1).join('/'),
      inbound: dayTransactions.filter(t => t.type === 'INBOUND').reduce((acc, t) => acc + t.quantity, 0),
      outbound: dayTransactions.filter(t => t.type === 'OUTBOUND').reduce((acc, t) => acc + t.quantity, 0),
    };
  });

  // Data for Category Analysis (Composed)
  const categoryAnalysis = products.reduce((acc: any[], p) => {
    const existing = acc.find(item => item.name === p.categoryId);
    const profit = transactions
      .filter(t => t.productId === p.id)
      .reduce((acc, t) => acc + (t.profit || 0), 0);
    
    if (existing) {
      existing.stock += p.currentStock;
      existing.profit += profit;
    } else {
      acc.push({ name: p.categoryId, stock: p.currentStock, profit });
    }
    return acc;
  }, []);

  // Data for Sales Volume (Top 5 Products)
  const salesVolumeData = products
    .map(p => ({
      name: p.name,
      volume: transactions
        .filter(t => t.productId === p.id && t.type === 'OUTBOUND')
        .reduce((acc, t) => acc + t.quantity, 0)
    }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5);

  return (
    <div className="space-y-8 -mt-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="累计总利润" 
            value={`¥${(totalProfit || 0).toLocaleString()}`} 
            icon={<TrendingUp className="text-emerald-500" size={20} />}
            trend="+18.2%"
            trendType="up"
            color="emerald"
          />
          <StatCard 
            title="当前总库存" 
            value={(totalStock || 0).toLocaleString()} 
            icon={<Package className="text-indigo-500" size={20} />}
            color="indigo"
          />
          <StatCard 
            title="库存告急" 
            value={(lowStockCount || 0).toString()} 
            icon={<AlertCircle className={lowStockCount > 0 ? "text-rose-500" : "text-gray-400"} size={20} />}
            subtitle="急需补货"
            color="rose"
          />
          <StatCard 
            title="出库走势" 
            value={(recentOutbound || 0).toLocaleString()} 
            icon={<ArrowUpRight className="text-amber-500" size={20} />}
            trend="+4.2%"
            trendType="up"
            color="amber"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stock Level Chart */}
          <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
            <CardHeader className="border-b border-gray-50 pb-3">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-indigo-500 rounded-full" />
                  各产品贡献利润 (¥)
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stockData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#F9FAFB' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                    />
                    <Bar 
                      dataKey="profit" 
                      radius={[6, 6, 0, 0]} 
                      barSize={32}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    >
                      {stockData.map((entry, index) => (
                        <Cell key={`cell-stock-${entry.name}-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
            <CardHeader className="border-b border-gray-50 pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <div className="w-1 h-5 bg-pink-500 rounded-full" />
                库存品类分布
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                      animationBegin={0}
                      animationDuration={1200}
                    >
                      {categoryData.map((entry: any, index: number) => (
                        <Cell key={`cell-category-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4">
                {categoryData.map((entry: any, index: number) => (
                  <div key={`legend-${entry.name}-${index}`} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-xs text-gray-500 font-semibold">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Daily Trend Chart (AreaChart) */}
          <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
            <CardHeader className="border-b border-gray-50 pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                近7日出入库走势 (数量)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyTrend}>
                    <defs>
                      <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="inbound" name="入库" stroke="#10B981" fillOpacity={1} fill="url(#colorIn)" strokeWidth={2} />
                    <Area type="monotone" dataKey="outbound" name="出库" stroke="#6366F1" fillOpacity={1} fill="url(#colorOut)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Analysis (Composed Chart) */}
          <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
            <CardHeader className="border-b border-gray-50 pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <div className="w-1 h-5 bg-amber-500 rounded-full" />
                品类库存与利润对比
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={categoryAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                    <Bar yAxisId="left" dataKey="stock" name="当前库存" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={20} />
                    <Line yAxisId="right" type="monotone" dataKey="profit" name="累计利润 (¥)" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, fill: '#F59E0B' }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Sales Volume Chart (Horizontal Bar) */}
          <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
            <CardHeader className="border-b border-gray-50 pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-500 rounded-full" />
                爆款产品销量榜 Top 5
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesVolumeData} layout="vertical" margin={{ left: 0, right: 30, top: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F3F4F6" />
                    <XAxis type="number" axisLine={false} tickLine={false} hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#6B7280' }}
                      width={80}
                    />
                    <Tooltip 
                      cursor={{ fill: '#F9FAFB' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                    />
                    <Bar 
                      dataKey="volume" 
                      name="销售数量"
                      radius={[0, 4, 4, 0]} 
                      barSize={20}
                    >
                      {salesVolumeData.map((entry, index) => (
                        <Cell key={`cell-sales-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}

function StatCard({ title, value, icon, trend, trendType, subtitle, color }: { 
  title: string, 
  value: string, 
  icon: React.ReactNode, 
  trend?: string, 
  trendType?: 'up' | 'down',
  subtitle?: string,
  color: string
}) {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-50',
    rose: 'bg-rose-50',
    emerald: 'bg-emerald-50',
    amber: 'bg-amber-50',
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="border-none shadow-sm bg-white rounded-2xl hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
            <div className={`p-1.5 ${colorMap[color] || 'bg-gray-50'} rounded-lg`}>
              {React.cloneElement(icon as React.ReactElement, { size: 16 })}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black tracking-tight text-gray-900 leading-none">{value}</h3>
            {trend && (
              <div className={`flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                trendType === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {trend}
              </div>
            )}
            {subtitle && (
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight whitespace-nowrap">{subtitle}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
