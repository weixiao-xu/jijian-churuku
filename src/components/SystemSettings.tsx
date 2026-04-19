/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SystemSettings } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { 
  Layers, 
  Ruler, 
  Warehouse, 
  Bell, 
  Save, 
  Plus, 
  Trash2,
  CheckCircle2
} from 'lucide-react';

interface SystemSettingsPageProps {
  settings: SystemSettings;
  onUpdate: (settings: SystemSettings) => void;
}

export default function SystemSettingsPage({ settings: initialSettings, onUpdate }: SystemSettingsPageProps) {
  const [localSettings, setLocalSettings] = useState<SystemSettings>(initialSettings);
  const [isSaved, setIsSaved] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [newWarehouse, setNewWarehouse] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleUpdate = (updated: SystemSettings) => {
    setLocalSettings(updated);
    setIsSaved(false);
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    const updated = {
      ...localSettings,
      categories: [...localSettings.categories, { id: Math.random().toString(36).substr(2, 9), name: newCategory.trim() }]
    };
    handleUpdate(updated);
    setNewCategory('');
  };

  const handleDeleteCategory = (id: string) => {
    const updated = {
      ...localSettings,
      categories: localSettings.categories.filter(c => c.id !== id)
    };
    handleUpdate(updated);
  };

  const handleAddUnit = () => {
    if (!newUnit.trim()) return;
    const updated = {
      ...localSettings,
      units: [...localSettings.units, { id: Math.random().toString(36).substr(2, 9), name: newUnit.trim() }]
    };
    handleUpdate(updated);
    setNewUnit('');
  };

  const handleDeleteUnit = (id: string) => {
    const updated = {
      ...localSettings,
      units: localSettings.units.filter(u => u.id !== id)
    };
    handleUpdate(updated);
  };

  const handleAddWarehouse = () => {
    if (!newWarehouse.trim()) return;
    const updated = {
      ...localSettings,
      warehouses: [...localSettings.warehouses, { id: Math.random().toString(36).substr(2, 9), name: newWarehouse.trim() }]
    };
    handleUpdate(updated);
    setNewWarehouse('');
  };

  const handleDeleteWarehouse = (id: string) => {
    const updated = {
      ...localSettings,
      warehouses: localSettings.warehouses.filter(w => w.id !== id)
    };
    handleUpdate(updated);
  };

  const handleSave = () => {
    onUpdate(localSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Category Settings */}
        <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-gray-50 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Layers size={18} className="text-indigo-500" /> 产品分类设置
            </CardTitle>
            <CardDescription className="text-xs">管理系统的产品所属分类</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 bg-gray-50/50 flex gap-2">
              <Input 
                placeholder="输入新分类..." 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="h-9 rounded-xl border-gray-200 text-xs"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <Button size="sm" onClick={handleAddCategory} className="bg-black hover:bg-gray-800 text-white rounded-xl h-9 px-3">
                <Plus size={16} />
              </Button>
            </div>
            <div className="divide-y divide-gray-50 max-h-[200px] overflow-y-auto custom-scrollbar">
              {localSettings.categories.map((c) => (
                <div key={c.id} className="p-4 flex justify-between items-center group hover:bg-gray-50/50 transition-colors">
                  <span className="text-sm font-bold text-gray-700">{c.name}</span>
                  {confirmDeleteId === c.id ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[10px] font-bold text-gray-400 hover:text-gray-900 hover:bg-transparent"
                        onClick={() => setConfirmDeleteId(null)}
                      >
                        取消
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-7 px-3 text-[10px] bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold shadow-sm"
                        onClick={() => {
                          handleDeleteCategory(c.id);
                          setConfirmDeleteId(null);
                        }}
                      >
                        确认删除
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="icon" onClick={() => setConfirmDeleteId(c.id)} className="h-7 w-7 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={12} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Unit Settings */}
        <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-gray-50 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Ruler size={18} className="text-emerald-500" /> 计量单位设置
            </CardTitle>
            <CardDescription className="text-xs">定义库存产品的计量单位</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 bg-gray-50/50 flex gap-2">
              <Input 
                placeholder="输入新单位..." 
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                className="h-9 rounded-xl border-gray-200 text-xs"
                onKeyDown={(e) => e.key === 'Enter' && handleAddUnit()}
              />
              <Button size="sm" onClick={handleAddUnit} className="bg-black hover:bg-gray-800 text-white rounded-xl h-9 px-3">
                <Plus size={16} />
              </Button>
            </div>
            <div className="divide-y divide-gray-50 max-h-[200px] overflow-y-auto custom-scrollbar">
              {localSettings.units.map((u) => (
                <div key={u.id} className="p-4 flex justify-between items-center group hover:bg-gray-50/50 transition-colors">
                  <span className="text-sm font-bold text-gray-700">{u.name}</span>
                  {confirmDeleteId === u.id ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[10px] font-bold text-gray-400 hover:text-gray-900 hover:bg-transparent"
                        onClick={() => setConfirmDeleteId(null)}
                      >
                        取消
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-7 px-3 text-[10px] bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold shadow-sm"
                        onClick={() => {
                          handleDeleteUnit(u.id);
                          setConfirmDeleteId(null);
                        }}
                      >
                        确认删除
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="icon" onClick={() => setConfirmDeleteId(u.id)} className="h-7 w-7 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={12} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Warehouse Settings */}
        <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-gray-50 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Warehouse size={18} className="text-amber-500" /> 仓库中心设置
            </CardTitle>
            <CardDescription className="text-xs">管理多仓存储体系</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 bg-gray-50/50 flex gap-2">
              <Input 
                placeholder="输入新仓库..." 
                value={newWarehouse}
                onChange={(e) => setNewWarehouse(e.target.value)}
                className="h-9 rounded-xl border-gray-200 text-xs"
                onKeyDown={(e) => e.key === 'Enter' && handleAddWarehouse()}
              />
              <Button size="sm" onClick={handleAddWarehouse} className="bg-black hover:bg-gray-800 text-white rounded-xl h-9 px-3">
                <Plus size={16} />
              </Button>
            </div>
            <div className="divide-y divide-gray-50 max-h-[200px] overflow-y-auto custom-scrollbar">
              {localSettings.warehouses.map((w) => (
                <div key={w.id} className="p-4 flex justify-between items-center group hover:bg-gray-50/50 transition-colors">
                  <span className="text-sm font-bold text-gray-700">{w.name}</span>
                  {confirmDeleteId === w.id ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[10px] font-bold text-gray-400 hover:text-gray-900 hover:bg-transparent"
                        onClick={() => setConfirmDeleteId(null)}
                      >
                        取消
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-7 px-3 text-[10px] bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold shadow-sm"
                        onClick={() => {
                          handleDeleteWarehouse(w.id);
                          setConfirmDeleteId(null);
                        }}
                      >
                        确认删除
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="icon" onClick={() => setConfirmDeleteId(w.id)} className="h-7 w-7 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={12} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alert & Rules Settings */}
        <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-gray-50 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Bell size={18} className="text-rose-500" /> 预警与编码规则
            </CardTitle>
            <CardDescription className="text-xs">配置全局库存预警与字段编码</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">全局库存预警阈值</Label>
              <Input 
                type="number" 
                value={localSettings.alertThreshold}
                onChange={(e) => handleUpdate({...localSettings, alertThreshold: parseInt(e.target.value) || 0})}
                className="h-11 rounded-xl border-gray-100 font-bold" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">单据编码规则</Label>
              <div className="grid grid-cols-2 gap-3">
                 <div className="px-3 py-2 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-tight">入库: RK-YYYYMMDD-XXX</div>
                 <div className="px-3 py-2 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-tight">出库: CK-YYYYMMDD-XXX</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4 items-center">
        {isSaved && (
          <div className="flex items-center gap-2 text-emerald-500 animate-in fade-in slide-in-from-right-4 duration-500">
            <CheckCircle2 size={16} />
            <span className="text-sm font-bold">设置已成功保存</span>
          </div>
        )}
        <Button 
          onClick={handleSave} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-10 gap-2 font-bold shadow-xl shadow-indigo-100 transition-all active:scale-95"
        >
          <Save size={18} /> 完成配置并保存
        </Button>
      </div>
    </div>
  );
}
