import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">About Us</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-600 hover:text-gray-900">Company</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-gray-900">Careers</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-gray-900">Contact</Link></li>
            </ul>
          </div>
          {/* 나머지 푸터 내용... */}
        </div>
        <div className="mt-8 pt-8 border-t text-center text-gray-600">
          © 2024 Shop. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;