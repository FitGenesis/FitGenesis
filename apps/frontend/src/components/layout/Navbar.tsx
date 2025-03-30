import React from 'react';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';

interface NavbarProps {
  currentUser?: {
    firstName: string;
    avatarUrl?: string;
  };
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const navItems = [
    { name: '主页', icon: HomeIcon, path: '/' },
    { name: '训练', icon: ChartBarIcon, path: '/workouts' },
    { name: '基因分析', icon: BeakerIcon, path: '/genetics' },
    { name: '代币', icon: CurrencyDollarIcon, path: '/tokens' },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="FitGenesis"
              />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-indigo-600"
                >
                  <item.icon className="h-5 w-5 mr-1" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  欢迎, {currentUser.firstName}
                </span>
                <Link
                  to="/profile"
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  {currentUser.avatarUrl ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={currentUser.avatarUrl}
                      alt={currentUser.firstName}
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8" />
                  )}
                </Link>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 