/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  History, 
  PlusCircle, 
  MinusCircle, 
  AlertTriangle, 
  TrendingUp, 
  LogOut, 
  User as UserIcon, 
  LogIn,
  Truck,
  Users,
  MapPin,
  FileText,
  Settings,
  ShieldCheck,
  ChevronDown,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Product, 
  Transaction, 
  User, 
  Supplier, 
  Customer, 
  Location, 
  SystemSettings 
} from './types';
import { 
  getStoredData, 
  saveProducts, 
  saveTransactions,
  saveSuppliers,
  saveCustomers,
  saveLocations,
  saveSettings
} from './lib/inventory';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import Dashboard from './components/Dashboard';
import InventoryTable from './components/InventoryTable';
import HistoryTable from './components/HistoryTable';
import TransactionDialog from './components/TransactionDialog';
import ProductDialog from './components/ProductDialog';
import FinancialStats from './components/FinancialStats';
import LoginDialog from './components/LoginDialog';
import SupplierManagement from './components/SupplierManagement';
import CustomerManagement from './components/CustomerManagement';
import LocationManagement from './components/LocationManagement';
import DocumentManagement from './components/DocumentManagement';
import SystemSettingsPage from './components/SystemSettings';
import UserManagement from './components/UserManagement';
import PrintDocumentDialog from './components/PrintDocumentDialog';
import ChatWidget from './components/ChatWidget';
import UserProfileDialog from './components/UserProfileDialog';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [dialogType, setDialogType] = useState<'INBOUND' | 'OUTBOUND'>('INBOUND');
  
  // Print state
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [printingTransaction, setPrintingTransaction] = useState<Transaction | null>(null);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [highlightLowStock, setHighlightLowStock] = useState(false);

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    '数据概览': false,
    '业务管理': false,
    '基础档案': false,
    '统计分析': false,
    '系统设置': false
  });

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  useEffect(() => {
    if (highlightLowStock) {
      const timer = setTimeout(() => setHighlightLowStock(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightLowStock]);

  useEffect(() => {
    const data = getStoredData();
    setProducts(data.products);
    setTransactions(data.transactions);
    setSuppliers(data.suppliers);
    setCustomers(data.customers);
    setLocations(data.locations);
    setSettings(data.settings);

    // Initial users check
    const savedUsers = localStorage.getItem('inventory_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const defaultUsers: User[] = [
        { id: '1', username: 'admin', name: '系统管理员', role: 'ADMIN', password: 'admin', department: '管理部', phone: '13800138000', status: 'ACTIVE' },
        { id: '2', username: 'operator', name: '王大力', role: 'OPERATOR', password: '123', department: '仓储部', phone: '13911112222', status: 'ACTIVE' },
      ];
      setUsers(defaultUsers);
      localStorage.setItem('inventory_users', JSON.stringify(defaultUsers));
    }

    // Initial auth check
    const savedUser = localStorage.getItem('inventory_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('inventory_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('inventory_user');
  };

  const handleTransaction = (data: {
    productId: string;
    type: 'INBOUND' | 'OUTBOUND';
    quantity: number;
    operator: string;
    note?: string;
    supplierId?: string;
    customerId?: string;
    locationId: string;
  }) => {
    const { productId, type, quantity, operator, note, supplierId, customerId, locationId } = data;
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newQuantity = type === 'INBOUND' 
      ? product.currentStock + quantity 
      : product.currentStock - quantity;

    if (newQuantity < 0) {
      alert('库存不足！');
      return;
    }

    const updatedProducts = products.map(p => 
      p.id === productId ? { ...p, currentStock: newQuantity } : p
    );

    const totalAmount = type === 'INBOUND' 
      ? product.purchasePrice * quantity 
      : product.sellingPrice * quantity;
    
    const profit = type === 'OUTBOUND'
      ? (product.sellingPrice - product.purchasePrice) * quantity
      : 0;

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      billNo: `BK-${Date.now()}`,
      productId,
      productName: product.name,
      type,
      quantity,
      price: type === 'INBOUND' ? product.purchasePrice : product.sellingPrice,
      date: new Date().toISOString(),
      operator,
      note,
      totalAmount,
      profit,
      supplierId,
      customerId,
      locationId,
      status: 'APPROVED',
      maker: operator
    };

    const updatedTransactions = [newTransaction, ...transactions];

    setProducts(updatedProducts);
    setTransactions(updatedTransactions);
    saveProducts(updatedProducts);
    saveTransactions(updatedTransactions);
    setIsDialogOpen(false);
  };

  const handleAddProduct = (newProductData: Omit<Product, 'id' | 'currentStock'> | Product) => {
    if ('id' in newProductData) {
      const updatedProducts = products.map(p => 
        p.id === newProductData.id ? { ...p, ...newProductData } : p
      );
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
    } else {
      const newProduct: Product = {
        ...newProductData,
        id: Math.random().toString(36).substr(2, 9),
        currentStock: 0,
      };

      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
    }
    setIsProductDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    const updatedTransactions = transactions.filter(t => t.productId !== productId);
    setProducts(updatedProducts);
    setTransactions(updatedTransactions);
    saveProducts(updatedProducts);
    saveTransactions(updatedTransactions);
  };

  const lowStockItems = products.filter(p => p.currentStock <= p.minStock);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans">
      {/* Sidebar / Navigation */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-8 z-10">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Package size={24} />
          </div>
          <h1 className="font-bold text-xl tracking-tight">微库管理系统</h1>
        </div>

        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-2 custom-scrollbar">
          <NavGroup title="数据概览" expanded={expandedGroups['数据概览']} onToggle={() => toggleGroup('数据概览')}>
            <NavItem 
              icon={<LayoutDashboard size={18} />} 
              label="数据看板" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
          </NavGroup>

          <NavGroup title="业务管理" expanded={expandedGroups['业务管理']} onToggle={() => toggleGroup('业务管理')}>
            <NavItem 
              icon={<FileText size={18} />} 
              label="单据中心" 
              active={activeTab === 'billings'} 
              onClick={() => setActiveTab('billings')} 
            />
          </NavGroup>

          <NavGroup title="基础档案" expanded={expandedGroups['基础档案']} onToggle={() => toggleGroup('基础档案')}>
            <NavItem 
              icon={<Package size={18} />} 
              label="产品管理" 
              active={activeTab === 'inventory'} 
              onClick={() => setActiveTab('inventory')} 
            />
            <NavItem 
              icon={<Truck size={18} />} 
              label="供应商管理" 
              active={activeTab === 'suppliers'} 
              onClick={() => setActiveTab('suppliers')} 
            />
            <NavItem 
              icon={<Users size={18} />} 
              label="客户管理" 
              active={activeTab === 'customers'} 
              onClick={() => setActiveTab('customers')} 
            />
            <NavItem 
              icon={<MapPin size={18} />} 
              label="库位管理" 
              active={activeTab === 'locations'} 
              onClick={() => setActiveTab('locations')} 
            />
          </NavGroup>

          <NavGroup title="统计分析" expanded={expandedGroups['统计分析']} onToggle={() => toggleGroup('统计分析')}>
            <NavItem 
              icon={<TrendingUp size={18} />} 
              label="财务报表" 
              active={activeTab === 'finance'} 
              onClick={() => setActiveTab('finance')} 
            />
            <NavItem 
              icon={<History size={18} />} 
              label="操作日志" 
              active={activeTab === 'history'} 
              onClick={() => setActiveTab('history')} 
            />
          </NavGroup>

          <NavGroup title="系统设置" expanded={expandedGroups['系统设置']} onToggle={() => toggleGroup('系统设置')}>
            <NavItem 
              icon={<Settings size={18} />} 
              label="基础设置" 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
            />
            {currentUser?.role === 'ADMIN' && (
              <NavItem 
                icon={<ShieldCheck size={18} />} 
                label="角色管理" 
                active={activeTab === 'users'} 
                onClick={() => setActiveTab('users')} 
              />
            )}
          </NavGroup>
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <Button 
            className="w-full justify-start gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 shadow-lg shadow-indigo-100 transition-all active:scale-95"
            onClick={() => { setDialogType('INBOUND'); setIsDialogOpen(true); }}
          >
            <PlusCircle size={18} /> 入库登记
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 border-gray-200 hover:bg-gray-50 rounded-xl h-11"
            onClick={() => { setDialogType('OUTBOUND'); setIsDialogOpen(true); }}
          >
            <MinusCircle size={18} /> 出库登记
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="ml-64 pl-6 pr-10 py-10 flex-1 transition-all duration-300">
        <header className="mb-10 flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-1">
              {{
                'dashboard': 'Overview',
                'billings': 'Bills',
                'inventory': 'Products',
                'suppliers': 'Suppliers',
                'customers': 'Customers',
                'locations': 'Locations',
                'finance': 'Finance',
                'history': 'Logs',
                'settings': 'Settings',
                'users': 'Security'
              }[activeTab] || 'Management'}
            </p>
            <h2 className="text-4xl font-black tracking-tight flex items-center gap-4">
              {{
                'dashboard': '数据看板',
                'billings': '单据中心',
                'inventory': '产品管理',
                'suppliers': '供应商管理',
                'customers': '客户管理',
                'locations': '库位管理',
                'finance': '财务报表',
                'history': '操作日志',
                'settings': '系统设置',
                'users': '角色管理'
              }[activeTab] || '管理系统'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {lowStockItems.length > 0 && (
              <button 
                onClick={() => {
                  setActiveTab('inventory');
                  setHighlightLowStock(true);
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold animate-pulse shadow-sm hover:bg-rose-100 transition-colors"
              >
                <AlertTriangle size={16} />
                <span>{lowStockItems.length} 个项目库存告急</span>
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center gap-3 bg-white p-2 pl-4 pr-3 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-900">{currentUser.name}</span>
                  <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-md leading-none">
                    {currentUser.role === 'ADMIN' ? '管理员' : '操作员'}
                  </span>
                </div>
                <button 
                  onClick={() => setIsProfileDialogOpen(true)}
                  className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                  title="查看个人信息"
                >
                  <UserIcon size={20} />
                </button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  className="rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors h-10 w-10"
                  title="退出登录"
                >
                  <LogOut size={20} />
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setIsLoginDialogOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-11 px-6 rounded-2xl font-bold shadow-lg shadow-indigo-100"
              >
                <LogIn size={20} /> 登录系统
              </Button>
            )}
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {activeTab === 'dashboard' && <Dashboard products={products} transactions={transactions} />}
            {activeTab === 'inventory' && (
              <InventoryTable 
                products={products} 
                onAddProduct={() => { setEditingProduct(null); setIsProductDialogOpen(true); }}
                onEditProduct={(product) => { setEditingProduct(product); setIsProductDialogOpen(true); }}
                onDeleteProduct={handleDeleteProduct}
                highlightLowStock={highlightLowStock}
              />
            )}
            {activeTab === 'suppliers' && (
              <SupplierManagement 
                suppliers={suppliers}
                onDelete={(id) => {
                  const updated = suppliers.filter(s => s.id !== id);
                  setSuppliers(updated);
                  saveSuppliers(updated);
                }}
                onAdd={(data) => {
                  const newSupplier: Supplier = { ...data, id: Math.random().toString(36).substr(2, 9) };
                  const updated = [...suppliers, newSupplier];
                  setSuppliers(updated);
                  saveSuppliers(updated);
                }}
                onEdit={(data) => {
                  const updated = suppliers.map(s => s.id === data.id ? data : s);
                  setSuppliers(updated);
                  saveSuppliers(updated);
                }}
              />
            )}
            {activeTab === 'customers' && (
              <CustomerManagement 
                customers={customers}
                onDelete={(id) => {
                  const updated = customers.filter(c => c.id !== id);
                  setCustomers(updated);
                  saveCustomers(updated);
                }}
                onAdd={(data) => {
                  const newCustomer: Customer = { ...data, id: Math.random().toString(36).substr(2, 9), debt: 0 };
                  const updated = [...customers, newCustomer];
                  setCustomers(updated);
                  saveCustomers(updated);
                }}
                onEdit={(data) => {
                  const updated = customers.map(c => c.id === data.id ? data : c);
                  setCustomers(updated);
                  saveCustomers(updated);
                }}
              />
            )}
            {activeTab === 'locations' && (
              <LocationManagement 
                locations={locations}
                onDelete={(id) => {
                  const updated = locations.filter(l => l.id !== id);
                  setLocations(updated);
                  saveLocations(updated);
                }}
                onAdd={(data) => {
                  const newLoc: Location = { ...data, id: Math.random().toString(36).substr(2, 9) };
                  const updated = [...locations, newLoc];
                  setLocations(updated);
                  saveLocations(updated);
                }}
                onEdit={(data) => {
                  const updated = locations.map(l => l.id === data.id ? data : l);
                  setLocations(updated);
                  saveLocations(updated);
                }}
              />
            )}
            {activeTab === 'billings' && (
              <DocumentManagement 
                transactions={transactions} 
                onAudit={(id) => {
                  const updated = transactions.map(t => 
                    t.id === id ? { ...t, status: 'APPROVED', approver: currentUser?.name } : t
                  );
                  setTransactions(updated);
                  saveTransactions(updated);
                }}
                onPrint={(tx) => {
                  setPrintingTransaction(tx);
                  setIsPrintDialogOpen(true);
                }}
              />
            )}
            {activeTab === 'finance' && <FinancialStats products={products} transactions={transactions} />}
            {activeTab === 'history' && <HistoryTable transactions={transactions} />}
            {activeTab === 'settings' && settings && (
              <SystemSettingsPage 
                settings={settings} 
                onUpdate={(newSettings) => {
                  setSettings(newSettings);
                  saveSettings(newSettings);
                }} 
              />
            )}
            {activeTab === 'users' && (
              <UserManagement 
                users={users}
                onAdd={(user) => {
                  const newUser: User = { ...user, id: Math.random().toString(36).substr(2, 9) };
                  const updated = [...users, newUser];
                  setUsers(updated);
                  localStorage.setItem('inventory_users', JSON.stringify(updated));
                }}
                onEdit={(user) => {
                  const updated = users.map(u => u.id === user.id ? user : u);
                  setUsers(updated);
                  localStorage.setItem('inventory_users', JSON.stringify(updated));
                }}
                onDelete={(id) => {
                  const updated = users.filter(u => u.id !== id);
                  setUsers(updated);
                  localStorage.setItem('inventory_users', JSON.stringify(updated));
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <TransactionDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        type={dialogType}
        products={products}
        suppliers={suppliers}
        customers={customers}
        locations={locations}
        onSubmit={handleTransaction}
      />

      <ProductDialog
        isOpen={isProductDialogOpen}
        onClose={() => { setIsProductDialogOpen(false); setEditingProduct(null); }}
        onSubmit={handleAddProduct}
        initialData={editingProduct}
      />

      <LoginDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
        onLogin={handleLogin}
      />

      <PrintDocumentDialog 
        isOpen={isPrintDialogOpen}
        onClose={() => setIsPrintDialogOpen(false)}
        transaction={printingTransaction}
        product={products.find(p => p.id === printingTransaction?.productId) || null}
      />

      <ChatWidget currentUser={currentUser} allUsers={users} />

      <UserProfileDialog
        isOpen={isProfileDialogOpen}
        onClose={() => setIsProfileDialogOpen(false)}
        user={currentUser}
      />
    </div>
  );
}

function NavGroup({ title, expanded, onToggle, children }: { title: string, expanded: boolean, onToggle: () => void, children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-2 text-xs font-black text-gray-400 uppercase tracking-[0.15em] mb-1 hover:text-indigo-600 transition-colors group"
      >
        <span>{title}</span>
        <motion.div 
          animate={{ rotate: expanded ? 0 : -90 }}
          className="text-gray-300 group-hover:text-gray-500"
        >
          <ChevronDown size={12} />
        </motion.div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden flex flex-col gap-1"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
        active 
          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.02]' 
          : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {icon}
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </button>
  );
}
