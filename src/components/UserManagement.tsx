/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User as UserType } from '../types';
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
  ShieldCheck, 
  Plus, 
  Edit2, 
  Trash2, 
  Key, 
  User as UserIcon, 
  Search, 
  AlertTriangle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import UserDialog from './UserDialog';
import PasswordDialog from './PasswordDialog';

interface UserManagementProps {
  users: UserType[];
  onAdd: (user: Omit<UserType, 'id'>) => void;
  onEdit: (user: UserType) => void;
  onDelete: (id: string) => void;
}

export default function UserManagement({ users, onAdd, onEdit, onDelete }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleLabels: Record<string, string> = {
    ADMIN: '系统管理员',
    OPERATOR: '仓库管理员',
    FINANCE: '财务人员',
    VIEWER: '审计查看',
  };

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-indigo-50 text-indigo-600',
    OPERATOR: 'bg-amber-50 text-amber-600',
    FINANCE: 'bg-emerald-50 text-emerald-600',
    VIEWER: 'bg-gray-50 text-gray-400',
  };

  const handleOpenDialog = (user?: UserType) => {
    setEditingUser(user || null);
    setIsDialogOpen(true);
  };

  const handleOpenPasswordDialog = (user: UserType) => {
    setEditingUser(user);
    setIsPasswordDialogOpen(true);
  };

  const handleSubmit = (data: Omit<UserType, 'id'> | UserType) => {
    if ('id' in data) {
      onEdit(data as UserType);
    } else {
      onAdd(data as any);
    }
    setIsDialogOpen(false);
  };

  const handlePasswordSubmit = (user: UserType) => {
    onEdit(user);
    setIsPasswordDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="搜索姓名或账号..." 
            className="pl-10 h-11 rounded-xl border-gray-100 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="bg-black hover:bg-gray-800 text-white rounded-xl h-11 px-6 gap-2 font-bold shadow-lg"
        >
          <Plus size={18} /> 新增人员
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-gray-50 hover:bg-transparent">
              <TableHead className="pl-6 font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">职员姓名/登录账号</TableHead>
              <TableHead className="font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">角色权限</TableHead>
              <TableHead className="font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">状态</TableHead>
              <TableHead className="font-bold text-gray-400 py-4 uppercase tracking-widest text-[10px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => {
              const isConfirming = confirmDeleteId === user.id;
              const isActive = user.status !== 'INACTIVE';

              return (
                <TableRow key={user.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                        <UserIcon size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{user.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 font-mono uppercase">ID: {user.username}</span>
                          {user.department && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 rounded uppercase">{user.department}</span>}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${roleColors[user.role]} border-none shadow-none text-[10px] font-black uppercase py-0.5`}>
                      {roleLabels[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <CheckCircle2 size={14} className={isActive ? "text-emerald-500" : "text-gray-300"} />
                       <span className={`text-[10px] font-bold uppercase ${isActive ? "text-emerald-500" : "text-gray-400"}`}>
                         {isActive ? "正常" : "禁用"}
                       </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-1 items-center">
                      {!isConfirming ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                            title="查看密钥并修改"
                            onClick={() => handleOpenPasswordDialog(user)}
                          >
                            <Key size={14} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                            title="全面修改"
                            onClick={() => handleOpenDialog(user)}
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            onClick={() => setConfirmDeleteId(user.id)}
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
                              onDelete(user.id);
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

      <UserDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingUser}
      />

      <PasswordDialog
        isOpen={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
        onSubmit={handlePasswordSubmit}
        user={editingUser}
      />
    </div>
  );
}
