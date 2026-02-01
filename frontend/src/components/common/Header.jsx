import { Link, useLocation as useRouterLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';

export default function Header() {
  const { language, toggleLanguage } = useApp();
  const routerLocation = useRouterLocation();

  const isActive = (path) => routerLocation.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-xl font-bold text-primary-600">
                {language === 'bn' ? 'সালাত ও সাওম' : 'Salat & Saom'}
              </h1>
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {language === 'bn' ? 'হোম' : 'Home'}
            </Link>
            <Link
              to="/prayer-times"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/prayer-times')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {language === 'bn' ? 'সালাত' : 'Prayer Times'}
            </Link>
            <Link
              to="/fasting-times"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/fasting-times')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {language === 'bn' ? 'সাওম' : 'Fasting Times'}
            </Link>
            <Link
              to="/calendar"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/calendar')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {language === 'bn' ? 'ক্যালেন্ডার' : 'Calendar'}
            </Link>
            <Link
              to="/settings"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/settings')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {language === 'bn' ? 'সেটিংস' : 'Settings'}
            </Link>

            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              title={language === 'en' ? 'Switch to Bengali' : 'Switch to English'}
            >
              {language === 'en' ? 'বাংলা' : 'EN'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
