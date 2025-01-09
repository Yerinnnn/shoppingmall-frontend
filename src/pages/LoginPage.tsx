import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const handleLoginSuccess = (token: string, username: string) => {
    login(token, username);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </a>
          </p>
        </div>
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
};

export default LoginPage;