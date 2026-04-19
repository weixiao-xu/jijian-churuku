/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types';
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
import { Button } from './ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from './ui/dialog';
import { Edit2, Trash2, Plus, Download, AlertTriangle } from 'lucide-react';
import { exportToExcel } from '../lib/excel';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface InventoryTableProps {
  products: Product[];
  onAddProduct?: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  highlightLowStock?: boolean;
}

export default function InventoryTable({ products, onAddProduct, onEditProduct, onDeleteProduct, highlightLowStock }: InventoryTableProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleExport = () => {
    const exportData = products.map(p => ({
      'SKU/编号': p.sku,
      '产品名称': p.name,
      '分类': p.categoryId,
      '当前库存': p.currentStock,
      '单位': p.unitId,
      '安全库存': p.minStock,
      '库存状态': p.currentStock <= p.minStock ? '库存告急' : '充足'
    }));
    exportToExcel(exportData, '库存列表', '库存');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-3">
        <Button 
          variant="outline" 
          onClick={handleExport} 
          className="border-gray-200 text-gray-600 hover:bg-gray-50 gap-2 rounded-xl"
        >
          <Download size={18} /> 导出 Excel
        </Button>
        {onAddProduct && (
          <Button onClick={onAddProduct} className="bg-black text-white hover:bg-gray-800 gap-2 rounded-xl">
            <Plus size={18} /> 新增产品
          </Button>
        )}
      </div>
      <Card className="border-none shadow-sm bg-white overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-gray-100">
              <TableHead className="pl-6 font-bold text-gray-900">产品信息</TableHead>
              <TableHead className="font-bold text-gray-900">分类</TableHead>
              <TableHead className="text-right font-bold text-gray-900">入库价</TableHead>
              <TableHead className="text-right font-bold text-gray-900">出库价</TableHead>
              <TableHead className="text-right font-bold text-gray-900">当前库存</TableHead>
              <TableHead className="text-center font-bold text-gray-900">状态</TableHead>
              <TableHead className="text-right font-bold text-gray-900 pr-6">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const isLowStock = product.currentStock <= product.minStock;
              const isConfirming = confirmDeleteId === product.id;
              const shouldAnimate = highlightLowStock && isLowStock;

              return (
                <motion.tr 
                  key={product.id} 
                  animate={shouldAnimate ? {
                    y: [0, -8, 0, -8, 0],
                    backgroundColor: ["rgba(255,255,255,1)", "rgba(255,241,242,1)", "rgba(255,255,255,1)", "rgba(255,241,242,1)", "rgba(255,255,255,1)"]
                  } : {}}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className={cn(
                    "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
                    "border-gray-50 hover:bg-gray-50/50"
                  )}
                >
                  <TableCell className="pl-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{product.name}</span>
                      <span className="text-xs text-gray-400 font-mono tracking-wider">{product.sku}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-gray-50 text-gray-500 border-none font-medium px-2 py-0">
                      {product.categoryId}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-gray-600">
                    ¥{(product.purchasePrice || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium text-gray-600">
                    ¥{(product.sellingPrice || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-bold text-gray-900">
                    {(product.currentStock || 0).toLocaleString()} <span className="text-xs font-normal text-gray-400">{product.unitId}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    {isLowStock ? (
                      <Badge className="bg-red-50 text-red-600 hover:bg-red-50 border-none shadow-none font-bold">
                        库存告急
                      </Badge>
                    ) : (
                      <Badge className="bg-green-50 text-green-600 hover:bg-green-50 border-none shadow-none font-bold">
                        充足
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-1 items-center">
                      {!isConfirming ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                            onClick={() => onEditProduct(product)}
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            onClick={() => setConfirmDeleteId(product.id)}
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
                              onDeleteProduct(product.id);
                              setConfirmDeleteId(null);
                            }}
                          >
                            确认删除
                          </Button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </div>
  );
}
