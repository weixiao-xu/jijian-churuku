/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from '../types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: Omit<User, 'id'> | User) => void;
  initialData?: User | null;
}

export default function UserDialog({ isOpen, onClose, onSubmit, initialData }: UserDialogProps) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'OPERATOR' | 'FINANCE' | 'VIEWER'>('OPERATOR');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setUsername(initialData.username || '');
      setRole(initialData.role || 'OPERATOR');
      setDepartment(initialData.department || '');
      setPhone(initialData.phone || '');
      setStatus(initialData.status || 'ACTIVE');
      setPassword(''); 
    } else {
      setName('');
      setUsername('');
      setRole('OPERATOR');
      setDepartment('');
      setPhone('');
      setStatus('ACTIVE');
      setPassword('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || (!initialData && !password)) return;
    
    const userData: any = {
      name,
      username,
      role,
      department,
      phone,
      status,
    };

    if (password) {
      userData.password = password;
    }

    if (initialData) {
      onSubmit({ ...initialData, ...userData });
    } else {
      onSubmit(userData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 border-b border-gray-50 pb-4">
            {initialData ? '修改用户信息' : '新增系统用户'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[80vh]">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="userName" className="text-xs font-bold text-gray-500 uppercase tracking-wider">用户姓名</Label>
                <Input
                  id="userName"
                  placeholder="请输入姓名"
                  className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="username" className="text-xs font-bold text-gray-500 uppercase tracking-wider">登录账号</Label>
                <Input
                  id="username"
                  placeholder="请输入登录凭据"
                  className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">所属部门</Label>
                <Input
                  placeholder="如：财务部、仓储部"
                  className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">联系电话</Label>
                <Input
                  placeholder="请输入手机号"
                  className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">系统角色</Label>
                <Select onValueChange={(v: any) => setRole(v)} value={role}>
                  <SelectTrigger className="w-full bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500">
                    <SelectValue placeholder="分配角色" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-100 rounded-xl">
                    <SelectItem value="ADMIN">超级管理员</SelectItem>
                    <SelectItem value="OPERATOR">仓库管理员</SelectItem>
                    <SelectItem value="FINANCE">财务出纳</SelectItem>
                    <SelectItem value="VIEWER">只读访客</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">账号状态</Label>
                <Select onValueChange={(v: any) => setStatus(v)} value={status}>
                  <SelectTrigger className="w-full bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-100 rounded-xl">
                    <SelectItem value="ACTIVE">正常启用</SelectItem>
                    <SelectItem value="INACTIVE">禁止登录</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!initialData && (
              <div className="space-y-1">
                <Label htmlFor="pass" className="text-xs font-bold text-gray-500 uppercase tracking-wider">初始密码</Label>
                <Input
                  id="pass"
                  type="password"
                  placeholder="******"
                  className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <DialogFooter className="p-6 bg-white border-t border-gray-50 m-0 rounded-none">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl h-11 px-6 font-bold text-gray-400">
              取消
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-8 font-bold shadow-lg shadow-indigo-100">
              {initialData ? '保存修改' : '确认添加'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
