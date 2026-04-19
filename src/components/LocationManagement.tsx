/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Location } from '../types';
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
import { Plus, Search, MapPin, Edit2, Trash2, Box, Layers, Hash, AlertTriangle } from 'lucide-react';
import LocationDialog from './LocationDialog';

interface LocationManagementProps {
  locations: Location[];
  onAdd: (location: Omit<Location, 'id'>) => void;
  onEdit: (location: Location) => void;
  onDelete: (id: string) => void;
}

export default function LocationManagement({ locations, onAdd, onEdit, onDelete }: LocationManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredLocations = locations.filter(l => 
    l.warehouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (location?: Location) => {
    if (location) {
      setEditingLocation(location);
    } else {
      setEditingLocation(null);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: Omit<Location, 'id'> | Location) => {
    if ('id' in data) {
      onEdit(data as Location);
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
            placeholder="搜索仓库名称或库位编码..." 
            className="pl-10 h-11 rounded-xl border-gray-100 focus:ring-amber-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl h-11 px-6 gap-2 font-bold shadow-lg shadow-amber-100"
        >
          <Plus size={18} /> 新增库位
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-gray-50 hover:bg-transparent">
              <TableHead className="pl-6 font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">仓库名称</TableHead>
              <TableHead className="font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">库区</TableHead>
              <TableHead className="font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">货架号</TableHead>
              <TableHead className="font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">库位编码</TableHead>
              <TableHead className="text-right pr-6 font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLocations.map((location) => {
              const isConfirming = confirmDeleteId === location.id;
              
              return (
                <TableRow key={location.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 font-bold text-sm">
                        <Box size={20} />
                      </div>
                      <span className="font-bold text-gray-900">{location.warehouseName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Layers size={14} className="text-gray-400" />
                      {location.area}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Hash size={14} className="text-gray-400" />
                      {location.shelf} 号架
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-3 py-1 bg-gray-50 text-indigo-600 border border-indigo-50 rounded-lg text-xs font-mono font-black">
                      {location.code}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-1 items-center">
                      {!isConfirming ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                            onClick={() => handleOpenDialog(location)}
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            onClick={() => setConfirmDeleteId(location.id)}
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
                              onDelete(location.id);
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

      <LocationDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingLocation}
      />
    </div>
  );
}
