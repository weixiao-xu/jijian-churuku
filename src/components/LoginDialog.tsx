/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User, LogIn, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { User as UserType } from '../types';
import { motion } from 'motion/react';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
  users?: UserType[];
  isFullPage?: boolean;
}

export default function LoginDialog({ isOpen, onClose, onLogin, users = [], isFullPage }: LoginDialogProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedUsername = username.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Emergency Bypass: Always allow admin with the correct master password
    if (trimmedUsername === 'admin' && trimmedPassword === '989426334') {
      const existingAdmin = users.find(u => u.username.toLowerCase() === 'admin');
      const adminToLogin = existingAdmin || { 
        id: '1', 
        username: 'admin', 
        name: '系统管理员', 
        role: 'ADMIN', 
        password: '989426334', 
        department: '管理部', 
        status: 'ACTIVE' 
      };
      onLogin(adminToLogin as UserType);
      onClose();
      return;
    }

    const user = users.find(u => u.username.toLowerCase() === trimmedUsername && u.status === 'ACTIVE');

    if (user && user.password === trimmedPassword) {
      onLogin(user);
      onClose();
    } else {
      setError('用户名或密码错误');
    }
  };

  const Content = (
    <div className={`bg-white rounded-3xl border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden w-full max-w-[420px]`}>
      <div className="bg-indigo-600 p-10 text-white flex flex-col items-center gap-6">
        <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md shadow-inner">
          <LogIn size={40} strokeWidth={2.5} />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight">欢迎回来</h1>
          <p className="text-indigo-100 font-medium mt-2 opacity-80">请登入您的微库账号进行管理</p>
        </div>
      </div>

      <form onSubmit={handleLogin} className="p-10 space-y-8 bg-white">
        <div className="space-y-6">
          <div className="space-y-2.5">
            <Label htmlFor="username" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">用户名</Label>
            <div className="relative group">
              <Input
                id="username"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50/50 group-hover:bg-white transition-all focus:ring-2 focus:ring-indigo-500/20 text-base font-medium"
              />
              <User className="absolute left-4 top-4.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            </div>
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">密码</Label>
            <div className="relative group">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="请输入密码"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="pl-12 pr-12 h-14 rounded-2xl border-gray-100 bg-gray-50/50 group-hover:bg-white transition-all focus:ring-2 focus:ring-indigo-500/20 text-base font-medium"
              />
              <ShieldCheck className="absolute left-4 top-4.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4.5 text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-rose-600 font-black bg-rose-50 px-4 py-3 rounded-xl border border-rose-100 text-center uppercase tracking-wide"
            >
              {error}
            </motion.p>
          )}
        </div>

        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white h-14 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 transition-all">
          进入系统
        </Button>
        
        <div className="pt-2">
          <p className="text-[10px] text-gray-300 text-center font-bold tracking-widest uppercase italic">
            Secure Infrastructure Powered by MicroStore
          </p>
        </div>
      </form>
    </div>
  );

  if (isFullPage) {
    return Content;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-fit">
        {Content}
      </DialogContent>
    </Dialog>
  );
}
