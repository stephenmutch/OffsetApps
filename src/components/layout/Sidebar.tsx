import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, FileSearch, ChevronLeft, ChevronRight, X, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: Home, label: 'Home', to: '/' },
    { icon: Users, label: 'Allocations', to: '/allocations' },
    { icon: Terminal, label: 'API Console', to: '/api' },
    { icon: FileSearch, label: 'Queries', to: '/queries' },
  ];

  return (
    <div 
      className={cn(
        "h-screen bg-sidebar flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && <span className="font-medium text-white">Offset Development</span>}
        <div className="flex items-center gap-2">
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-gray-700"
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex text-white hover:bg-gray-700"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-300 hover:text-white",
                "hover:bg-gray-700/50",
                isActive ? "bg-gray-700/50 text-white font-medium" : "text-gray-300",
                isCollapsed && "justify-center"
              )
            }
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-700 space-y-2">
          <div className="text-sm text-gray-400">© 2025</div>
          <div className="space-y-1">
            <a href="#" className="block text-sm text-gray-400 hover:text-white">Terms & Conditions</a>
            <a href="#" className="block text-sm text-gray-400 hover:text-white">Privacy Policy</a>
            <a href="#" className="block text-sm text-gray-400 hover:text-white">Support</a>
          </div>
        </div>
      )}
    </div>
  );
}