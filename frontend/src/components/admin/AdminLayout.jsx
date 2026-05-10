import { NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext.jsx';

const NAV = [
  { to: '/admin',       label: 'Dashboard', exact: true, icon: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  )},
  { to: '/admin/books', label: 'Books', icon: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  )},
  { to: '/admin/duas',  label: "Du'a", icon: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
  )},
];

export default function AdminLayout({ children }) {
  const { username, logout } = useAdmin();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-gray-200 dark:border-gray-700">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg dark:bg-white overflow-hidden">
            <img src="/icons/logo.png" alt="" className="w-full h-full object-contain mix-blend-multiply"
              style={{ filter: 'hue-rotate(122deg) saturate(1.4) brightness(0.72)' }} />
          </span>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-none">Hidayah</p>
            <p className="text-[10px] text-gray-400 leading-none mt-0.5">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {NAV.map(({ to, label, exact, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`
              }
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {icon}
              </svg>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">{username}</p>
          <button
            onClick={handleLogout}
            className="w-full text-left text-xs text-red-600 dark:text-red-400 hover:underline"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
