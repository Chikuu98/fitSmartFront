import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShieldX } from 'lucide-react';
import type { RootState } from '../../store/store';
import { UserRole } from '../../enums/userDetailEnums';
import { initializeTheme } from '../../hooks/useTheme';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    initializeTheme();
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToDashboard = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    switch (user.role) {
      case UserRole.ADMIN:
        navigate('/admin-dashboard');
        break;
      case UserRole.MEMBER:
        navigate('/member-dashboard');
        break;
      case UserRole.MENTOR:
        navigate('/mentor-dashboard');
        break;
      default:
        navigate('/');
        break;
    }
  };

  const getDashboardLabel = () => {
    if (!user) return 'Login';
    
    switch (user.role) {
      case UserRole.ADMIN:
        return 'Admin Dashboard';
      case UserRole.MEMBER:
        return 'Member Dashboard';
      case UserRole.MENTOR:
        return 'Mentor Dashboard';
      default:
        return 'Home';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center transition-colors duration-300">
        <div className="mx-auto w-24 h-24 text-red-500 mb-6 flex items-center justify-center">
          <ShieldX className="w-full h-full" />
        </div>

        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-4">
          401
        </h1>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Unauthorized Access
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Sorry, you don't have permission to access this page. 
          Please check your credentials or contact an administrator.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoBack}
            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:-translate-y-0.5 font-medium"
          >
            Go Back
          </button>
          <button
            onClick={handleGoToDashboard}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:-translate-y-0.5 font-medium shadow-md"
          >
            {getDashboardLabel()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;