// App.tsx - Add lazy loading
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load page components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Messages = lazy(() => import('./pages/Messages'));
const OfferSkills = lazy(() => import('./pages/OfferSkills'));
const ExploreSkills = lazy(() => import('./pages/ExploreSkills'));
const FindSkills = lazy(() => import('./pages/FindSkills'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const Schedule = lazy(() => import('./pages/Schedule'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/offer-skills" element={<OfferSkills />} />
        <Route path="/explore-skills" element={<ExploreSkills />} />
        <Route path="/find-skills" element={<FindSkills />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Suspense>
  );
}