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
import { Eye, EyeOff } from 'lucide-react';

interface PasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: User) => void;
  user: User | null;
}

export default function PasswordDialog({ isOpen, onClose, onSubmit, user }: PasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setPassword(user?.password || '');
    setShowPassword(false);
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    onSubmit({ ...user, password });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 border-b border-gray-50 pb-4">
            凭据管理
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">登录账号</Label>
              <Input
                value={user?.username || ''}
                readOnly
                className="bg-gray-100 border-none rounded-xl h-11 text-gray-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="passChange" className="text-xs font-bold text-gray-500 uppercase tracking-wider">登录密码</Label>
              <div className="relative">
                <Input
                  id="passChange"
                  type={showPassword ? "text" : "password"}
                  placeholder="设置新密码"
                  className="bg-gray-50 border-gray-100 rounded-xl h-11 focus:ring-indigo-500 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">您可以直接查看到当前密码，也可以进行修改。</p>
            </div>
          </div>

          <DialogFooter className="pt-6 gap-2">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl h-11 px-6 font-bold text-gray-400">
              关闭
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-8 font-bold shadow-lg">
              保存修改
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
