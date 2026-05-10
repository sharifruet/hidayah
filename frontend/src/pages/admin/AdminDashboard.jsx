import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext.jsx';
import AdminLayout from '../../components/admin/AdminLayout.jsx';

export default function AdminDashboard() {
  const { authFetch } = useAdmin();
  const [stats, setStats] = useState({ books: '—', duas: '—' });

  useEffect(() => {
    Promise.all([
      authFetch('/books').then(d => d.length).catch(() => '?'),
      authFetch('/duas').then(d => d.length).catch(() => '?'),
    ]).then(([books, duas]) => setStats({ books, duas }));
  }, [authFetch]);

  const cards = [
    { label: 'Books', count: stats.books, to: '/admin/books', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
    { label: "Du'a", count: stats.duas,  to: '/admin/duas',  color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cards.map(({ label, count, to, color }) => (
            <Link key={to} to={to} className={`rounded-xl p-6 ${color} hover:opacity-80 transition-opacity`}>
              <p className="text-3xl font-bold mb-1">{count}</p>
              <p className="text-sm font-medium opacity-80">{label}</p>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
