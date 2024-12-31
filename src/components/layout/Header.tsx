import React from 'react';
import { Search, ShoppingCart, Heart, User } from 'lucide-react';

export const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="text-2xl font-bold">Ubu the Bear</a>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text"
                placeholder="Search products..."
                className="w-64 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
            
            <nav className="flex items-center space-x-6">
              <a href="/cart" className="flex items-center text-gray-700 hover:text-blue-600">
                <ShoppingCart className="w-6 h-6" />
              </a>
              <a href="/wishlist" className="flex items-center text-gray-700 hover:text-blue-600">
                <Heart className="w-6 h-6" />
              </a>
              <a href="/login" className="flex items-center text-gray-700 hover:text-blue-600">
                <User className="w-6 h-6" />
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};