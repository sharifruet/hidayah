import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { AdminProvider } from './context/AdminContext.jsx';
import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import BottomTabBar from './components/common/BottomTabBar.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import OfflineBanner from './components/common/OfflineBanner.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import PrayerTimes from './pages/PrayerTimes.jsx';
import CalculationMethods from './pages/CalculationMethods.jsx';
import Calendar from './pages/Calendar.jsx';
import Settings from './pages/Settings.jsx';
import Quran from './pages/Quran.jsx';
import QuranReader from './pages/QuranReader.jsx';
import QuranSearch from './pages/QuranSearch.jsx';
import QuranMushaf from './pages/QuranMushaf.jsx';
import QuranJuz from './pages/QuranJuz.jsx';
import Hadith from './pages/Hadith.jsx';
import HadithBooks from './pages/HadithBooks.jsx';
import HadithReader from './pages/HadithReader.jsx';
import HadithSearch from './pages/HadithSearch.jsx';
import Bookmarks from './pages/Bookmarks.jsx';
import Duas from './pages/Duas.jsx';
import Books from './pages/Books.jsx';
import BookDetail from './pages/BookDetail.jsx';
import BookReader from './pages/BookReader.jsx';
import Masjids from './pages/Masjids.jsx';
import MasjidDetail from './pages/MasjidDetail.jsx';
import MasjidNew from './pages/MasjidNew.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminBooks from './pages/admin/AdminBooks.jsx';
import AdminBookChapters from './pages/admin/AdminBookChapters.jsx';
import AdminDuas from './pages/admin/AdminDuas.jsx';
import AdminMasjids from './pages/admin/AdminMasjids.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function AppShell() {
  const { language } = useApp();
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <OfflineBanner language={language} />
      <Header />
      <main className="flex-grow pb-16 sm:pb-0">
        <ErrorBoundary label="Page">
          <Routes>
            <Route path="/"                            element={<Home />} />
            <Route path="/prayer-times"                element={<PrayerTimes />} />
            <Route path="/methods"                     element={<CalculationMethods />} />
            <Route path="/calendar"                    element={<Calendar />} />
            <Route path="/settings"                    element={<Settings />} />
            <Route path="/quran"                       element={<Quran />} />
            <Route path="/quran/juz"                   element={<QuranJuz />} />
            <Route path="/quran/search"                element={<QuranSearch />} />
            <Route path="/quran/page/:pageNumber"      element={<QuranMushaf />} />
            <Route path="/quran/:surahNumber"          element={<QuranReader />} />
            <Route path="/quran/:surahNumber/:ayahRef" element={<QuranReader />} />
            <Route path="/hadith"                                element={<Hadith />} />
            <Route path="/hadith/search"                         element={<HadithSearch />} />
            <Route path="/hadith/:collectionSlug"                element={<HadithBooks />} />
            <Route path="/hadith/:collectionSlug/:bookNumber"    element={<HadithReader />} />
            <Route path="/bookmarks"                   element={<Bookmarks />} />
            <Route path="/duas"                        element={<Duas />} />
            <Route path="/books"                       element={<Books />} />
            <Route path="/books/:slug/read"            element={<BookReader />} />
            <Route path="/books/:slug"                 element={<BookDetail />} />
            <Route path="/masjids"                     element={<Masjids />} />
            <Route path="/masjids/new"                 element={<MasjidNew />} />
            <Route path="/masjids/:id"                 element={<MasjidDetail />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
      <BottomTabBar />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AdminProvider>
          <Router>
            <Routes>
              {/* Admin routes — no header/footer */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/books" element={<ProtectedRoute><AdminBooks /></ProtectedRoute>} />
              <Route path="/admin/books/:id/chapters" element={<ProtectedRoute><AdminBookChapters /></ProtectedRoute>} />
              <Route path="/admin/duas" element={<ProtectedRoute><AdminDuas /></ProtectedRoute>} />
              <Route path="/admin/masjids" element={<ProtectedRoute><AdminMasjids /></ProtectedRoute>} />
              {/* Public app */}
              <Route path="/*" element={<AppShell />} />
            </Routes>
          </Router>
        </AdminProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
