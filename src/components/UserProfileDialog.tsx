import React from 'react';
import { User } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { 
  User as UserIcon, 
  ShieldCheck, 
  Fingerprint, 
  CircleDot,
  Building2,
  Phone
} from 'lucide-react';
import { Badge } from './ui/badge';

interface UserProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function UserProfileDialog({ isOpen, onClose, user }: UserProfileDialogProps) {
  if (!user) return null;

  const roleLabels: Record<string, string> = {
    ADMIN: '系统管理员',
    OPERATOR: '仓库管理员',
    FINANCE: '财务人员',
    VIEWER: '审计查看',
  };

  const isActive = user.status !== 'INACTIVE';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[360px] bg-white rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-indigo-600 h-24 relative">
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white">
              <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center text-indigo-600">
                <UserIcon size={32} />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-14 pb-8 px-6 text-center">
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-widest">@{user.username}</p>
          
          <div className="mt-6 space-y-3 text-left">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-indigo-500" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">角色权限</span>
              </div>
              <Badge className="bg-indigo-100 text-indigo-600 border-none shadow-none text-[10px] font-black uppercase">
                {roleLabels[user.role]}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Fingerprint size={16} className="text-emerald-500" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">账户 ID</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-gray-700">{user.id}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <CircleDot size={16} className={isActive ? "text-emerald-500" : "text-gray-300"} />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">账号状态</span>
              </div>
              <span className={`text-[10px] font-black uppercase ${isActive ? "text-emerald-500" : "text-rose-500"}`}>
                {isActive ? "正常服务中" : "已锁定"}
              </span>
            </div>

            {(user.department || user.phone) && (
              <div className="pt-2 grid grid-cols-2 gap-2">
                {user.department && (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl">
                    <Building2 size={14} className="text-indigo-400" />
                    <span className="text-[10px] font-bold text-gray-600">{user.department}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl">
                    <Phone size={14} className="text-indigo-400" />
                    <span className="text-[10px] font-bold text-gray-600">{user.phone}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
