import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import LoadingSpinner from './components/common/LoadingSpinner';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import ExploreProjectsPage from './pages/ExploreProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import CreateProjectPage from './pages/CreateProjectPage';
import EditProjectPage from './pages/EditProjectPage';

// Route guard: only for logged-in, onboarded users
function PrivateRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <LoadingSpinner fullPage />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.onboardingCompleted) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}

// Route guard: only for logged-in users (onboarding not required)
function AuthRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner fullPage />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

// Route guard: only for guests
function GuestRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <LoadingSpinner fullPage />;
  if (isAuthenticated) {
    if (!user?.onboardingCompleted) return <Navigate to="/onboarding" replace />;
    return <Navigate to={`/profile/${user.username}`} replace />;
  }
  return <Outlet />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Project Discovery (Public Views) */}
        <Route path="/projects" element={<ExploreProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />

        {/* Guest Routes */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Onboarding */}
        <Route element={<AuthRoute />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>

        {/* Authenticated / Onboarded Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/projects/create" element={<CreateProjectPage />} />
          <Route path="/projects/:id/edit" element={<EditProjectPage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
