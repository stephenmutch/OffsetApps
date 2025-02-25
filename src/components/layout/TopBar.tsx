import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopBarProps {
  children?: React.ReactNode;
}

export function TopBar({ children }: TopBarProps) {
  const { user, signOut } = useAuth();

  return (
    <div className="h-16 bg-sidebar border-b border-gray-700 flex items-center px-4 gap-4">
      {children}
      
      <div className="flex-1 flex items-center justify-end gap-4">
        {/* Search - hidden on mobile */}
        <div className="relative hidden md:block w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="search"
            placeholder="Search orders, customers, and products"
            className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg 
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 text-white hover:text-gray-200">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.email?.[0].toUpperCase()}
                </span>
              </div>
              <span className="hidden md:block">{user?.email}</span>
              <ChevronDown className="hidden md:block w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-sm">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-sm">Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-sm text-red-600 focus:text-red-600" 
              onClick={() => signOut()}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}