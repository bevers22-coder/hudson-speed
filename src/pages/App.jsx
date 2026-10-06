import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Home from '@/pages/Home';
import Book from '@/pages/Book';
import Manage from '@/pages/Manage';
import Custom404 from '@/pages/Custom404';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminSessions from '@/pages/admin/Sessions';
import AdminBlockedDates from '@/pages/admin/BlockedDates';
import AdminBookings from '@/pages/admin/Bookings';
import AdminWeeklyReport from '@/pages/admin/WeeklyReport';
import AdminSettings from '@/pages/admin/Settings';
import AdminImages from '@/pages/admin/Images';
import AdminEmailLog from '@/pages/admin/EmailLog';
import AdminRoute from '@/components/AdminRoute';
import Program from '@/pages/Program';
import Schedule from '@/pages/Schedule';
import Coach from '@/pages/Coach';
import Location from '@/pages/Location';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Account from '@/pages/Account';
import Calendar from '@/pages/Calendar';
import StaffSignIn from '@/pages/StaffSignIn';
import StaffHome from '@/pages/StaffHome';
import { Navigate } from 'react-router-dom';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/book" element={<Book />} />
      <Route path="/manage" element={<Manage />} />
      <Route path="/program" element={<Program />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/coach" element={<Coach />} />
      <Route path="/location" element={<Location />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/account" element={<Account />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/staff" element={<StaffSignIn />} />
      <Route path="/staff/home" element={<StaffHome />} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/sessions" element={<AdminRoute><AdminSessions /></AdminRoute>} />
      <Route path="/admin/blocked-dates" element={<AdminRoute><AdminBlockedDates /></AdminRoute>} />
      <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
      <Route path="/admin/weekly-report" element={<AdminRoute><AdminWeeklyReport /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
      <Route path="/admin/images" element={<AdminRoute><AdminImages /></AdminRoute>} />
      <Route path="/admin/email-log" element={<AdminRoute><AdminEmailLog /></AdminRoute>} />
      <Route path="*" element={<Custom404 />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
