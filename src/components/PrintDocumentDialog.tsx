/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Transaction, Product } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Printer, Download, Share2, Scissors, FileText } from 'lucide-react';

interface PrintDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  product: Product | null;
}

export default function PrintDocumentDialog({ isOpen, onClose, transaction, product }: PrintDocumentDialogProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!transaction) return null;

  const handlePrint = () => {
    const printContent = printRef.current;
    const WindowPnt = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    if (!WindowPnt) return;
    
    WindowPnt.document.write(`
      <html>
        <head>
          <title>单据打印 - ${transaction.billNo || transaction.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; }
            .bill-card { border: 2px solid #000; padding: 20px; position: relative; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .info-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            .footer { margin-top: 40px; display: flex; justify-content: space-between; }
            .stamp { width: 100px; height: 100px; border: 3px solid red; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: red; transform: rotate(-15deg); position: absolute; bottom: 40px; right: 40px; opacity: 0.5; font-weight: bold; font-size: 20px; }
          </style>
        </head>
        <body>
          ${printContent?.innerHTML}
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    WindowPnt.document.close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="sm:max-w-[700px] bg-white rounded-2xl border-none shadow-2xl overflow-hidden p-0">
        <DialogHeader className="p-6 bg-gray-50 border-b border-gray-100 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-xl font-black text-gray-900 flex items-center gap-2">
            <FileText className="text-indigo-500" size={24} />
            业务单据预览
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-8 max-h-[70vh] overflow-y-auto bg-gray-100/50">
          <div ref={printRef} className="bg-white p-10 shadow-xl rounded-sm border border-gray-200 relative mx-auto w-full max-w-[600px] aspect-[1/1.414]">
            <div className="bill-card">
              <div className="header">
                <h1 className="text-2xl font-black uppercase tracking-[0.2em] mb-1">微库管理系统</h1>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Minimalist Inventory Billing Document</p>
                <div className="mt-4 flex justify-between items-end">
                   <span className={`px-4 py-1.5 rounded-full text-white font-black text-sm ${transaction.type === 'INBOUND' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                     {transaction.type === 'INBOUND' ? '入库单' : '出库单'}
                   </span>
                   <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">No. {transaction.billNo || transaction.id}</p>
                      <p className="text-xs font-bold text-gray-900">{new Date(transaction.date).toLocaleString()}</p>
                   </div>
                </div>
              </div>

              <div className="info-grid grid grid-cols-2 gap-y-4 mb-8">
                 <div>
                    <label className="text-[10px] text-gray-400 font-black uppercase block mb-1">经办分部 / 仓库</label>
                    <p className="text-sm font-bold text-gray-900">{transaction.locationId || '默认主体仓库'}</p>
                 </div>
                 <div>
                    <label className="text-[10px] text-gray-400 font-black uppercase block mb-1">{transaction.type === 'INBOUND' ? '供应单位' : '提货单位'}</label>
                    <p className="text-sm font-bold text-gray-900">{transaction.supplierId || transaction.customerId || '零散客户/通用'}</p>
                 </div>
                 <div>
                    <label className="text-[10px] text-gray-400 font-black uppercase block mb-1">业务类型</label>
                    <p className="text-sm font-bold text-gray-900">{transaction.type === 'INBOUND' ? '采购入库' : '销售出库'}</p>
                 </div>
                 <div>
                    <label className="text-[10px] text-gray-400 font-black uppercase block mb-1">备注说明</label>
                    <p className="text-sm font-bold text-gray-600 italic">"{transaction.note || '无备注'}"</p>
                 </div>
              </div>

              <table className="w-full border-collapse mb-8">
                <thead>
                  <tr className="border-y-2 border-black bg-gray-50">
                    <th className="py-2 text-left text-xs font-black uppercase">货物名称</th>
                    <th className="py-2 text-right text-xs font-black uppercase">数量</th>
                    <th className="py-2 text-right text-xs font-black uppercase">单价 (¥)</th>
                    <th className="py-2 text-right text-xs font-black uppercase">金额小计 (¥)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 text-sm font-bold">
                       {transaction.productName}
                       <span className="block text-[10px] text-gray-400 mt-1">ID: {transaction.productId}</span>
                    </td>
                    <td className="py-4 text-right text-sm font-black">{transaction.quantity}</td>
                    <td className="py-4 text-right text-sm font-medium">{(transaction.price || 0).toFixed(2)}</td>
                    <td className="py-4 text-right text-sm font-black">{(transaction.totalAmount || 0).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-end mb-10">
                 <div className="text-right border-t-2 border-black pt-4 px-4">
                    <span className="text-[10px] text-gray-400 font-black uppercase">合计应收/付金额</span>
                    <p className="text-3xl font-black text-gray-900">¥{(transaction.totalAmount || 0).toLocaleString()}</p>
                 </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400">
                 <div className="flex gap-8">
                    <div>制单人: <span className="text-gray-900 ml-2">{transaction.maker || '系统管理员'}</span></div>
                    <div>审核人: <span className="text-gray-900 ml-2">{transaction.status === 'APPROVED' ? '已自动审核' : '待手动审核'}</span></div>
                    <div>签章: <div className="inline-block w-20 border-b border-gray-300 ml-2 transform translate-y-2"></div></div>
                 </div>
              </div>
              
              <div className="stamp border-emerald-500/30 text-emerald-500/30">
                {transaction.status === 'APPROVED' ? 'AUDITED' : 'DRAFT'}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-8 bg-white border-t border-gray-50">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-gray-400 px-6 h-11">
            关闭预览
          </Button>
          <Button onClick={handlePrint} className="bg-black text-white hover:bg-gray-800 rounded-xl px-12 h-11 gap-2 font-black shadow-xl">
             <Printer size={18} /> 打印并存档
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
