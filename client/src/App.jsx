import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import About from './pages/About';
import Register from './pages/Register';
import Login from './pages/Login';
import ReportIssue from './pages/ReportIssue';
import TrackComplaint from './pages/TrackComplaint';
import MyComplaints from './pages/MyComplaints';
import UserDashboard from './pages/UserDashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminComplaints from './pages/AdminComplaints';
import AdminComplaintDetail from './pages/AdminComplaintDetail';
import AdminUsers from './pages/AdminUsers';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSettings from './pages/AdminSettings';
import NotFound from './pages/NotFound';
import { RequireAuth, RequireAdmin, RedirectIfAuthed } from './components/RouteGuards';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/track" element={<TrackComplaint />} />

      <Route path="/register" element={<RedirectIfAuthed><Register /></RedirectIfAuthed>} />
      <Route path="/login" element={<RedirectIfAuthed><Login /></RedirectIfAuthed>} />

      {/* Citizen routes */}
      <Route path="/dashboard" element={<RequireAuth><UserDashboard /></RequireAuth>} />
      <Route path="/report" element={<RequireAuth><ReportIssue /></RequireAuth>} />
      <Route path="/my-complaints" element={<RequireAuth><MyComplaints /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />

      {/* Admin routes */}
      <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
      <Route path="/admin/complaints" element={<RequireAdmin><AdminComplaints /></RequireAdmin>} />
      <Route path="/admin/complaints/:complaintId" element={<RequireAdmin><AdminComplaintDetail /></RequireAdmin>} />
      <Route path="/admin/users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
      <Route path="/admin/analytics" element={<RequireAdmin><AdminAnalytics /></RequireAdmin>} />
      <Route path="/admin/settings" element={<RequireAdmin><AdminSettings /></RequireAdmin>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
