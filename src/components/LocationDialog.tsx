/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Location } from '../types';
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

interface LocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (location: Omit<Location, 'id'> | Location) => void;
  initialData?: Location | null;
}

export default function LocationDialog({ isOpen, onClose, onSubmit, initialData }: LocationDialogProps) {
  const [warehouseName, setWarehouseName] = useState('');
  const [area, setArea] = useState('');
  const [shelf, setShelf] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    if (initialData) {
      setWarehouseName(initialData.warehouseName || '');
      setArea(initialData.area || '');
      setShelf(initialData.shelf || '');
      setCode(initialData.code || '');
    } else {
      setWarehouseName('');
      setArea('');
      setShelf('');
      setCode('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warehouseName || !code) return;
    
    const locationData = {
      warehouseName,
      area,
      shelf,
      code,
    };

    if (initialData) {
      onSubmit({ ...initialData, ...locationData });
    } else {
      onSubmit(locationData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 border-b border-gray-50 pb-4">
            {initialData ? '编辑库位' : '新增库位'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-1">
            <Label htmlFor="warehouse" className="text-xs font-bold text-gray-500 uppercase tracking-wider">仓库名称</Label>
            <Input
              id="warehouse"
              placeholder="例如：主仓库、A区仓库"
              className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-amber-500"
              value={warehouseName}
              onChange={(e) => setWarehouseName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="area" className="text-xs font-bold text-gray-500 uppercase tracking-wider">区域</Label>
              <Input
                id="area"
                placeholder="例如：成品区"
                className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-amber-500"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="shelf" className="text-xs font-bold text-gray-500 uppercase tracking-wider">货架号</Label>
              <Input
                id="shelf"
                placeholder="例如：H-01"
                className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-amber-500"
                value={shelf}
                onChange={(e) => setShelf(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="code" className="text-xs font-bold text-gray-500 uppercase tracking-wider">库位编码</Label>
            <Input
              id="code"
              placeholder="唯一识别码 (例如：A1-02-03)"
              className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-amber-500"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="pt-6 gap-2">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl h-11 px-6 font-bold text-gray-400">
              取消
            </Button>
            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl h-11 px-8 font-bold shadow-lg shadow-amber-100">
              {initialData ? '保存修改' : '确认添加'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
