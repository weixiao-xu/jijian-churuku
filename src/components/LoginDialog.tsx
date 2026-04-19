/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User, LogIn, ShieldCheck } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
}

export default function LoginDialog({ isOpen, onClose, onLogin }: LoginDialogProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Pre-set accounts for demonstration as requested
    if (username === 'admin' && password === '123456') {
      onLogin({ id: '1', username: 'admin', name: '系统管理员', role: 'ADMIN', status: 'ACTIVE', department: '管理部' });
      onClose();
    } else if (username === 'operator' && password === '123456') {
      onLogin({ id: '2', username: 'operator', name: '王大力', role: 'OPERATOR', status: 'ACTIVE', department: '仓储部' });
      onClose();
    } else {
      setError('用户名或密码错误 (试用: admin/123456)');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <LogIn size={32} />
          </div>
          <div className="text-center">
            <DialogTitle className="text-2xl font-bold">欢迎回来</DialogTitle>
            <DialogDescription className="text-indigo-100 mt-1">请登入您的微库账号进行管理</DialogDescription>
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <div className="relative">
                <Input
                  id="username"
                  placeholder="请输入用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-gray-100 focus:ring-indigo-500"
                />
                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-gray-100 focus:ring-indigo-500"
                />
                <ShieldCheck className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>
            {error && (
              <p className="text-xs text-rose-500 font-bold bg-rose-50 p-2 rounded-lg border border-rose-100 text-center">
                {error}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white h-12 rounded-xl font-bold shadow-lg">
            登录系统
          </Button>
          
          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            默认账号: admin / operator<br/>
            默认密码: 123456
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
