import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile'; // <- NUEVO
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Stats from './pages/Stats';
import GameView from './pages/Game';
import GameChoose from './pages/GenshinOrWuWa';
import { AuthProvider, useAuth } from './context/AuthContext';

function PrivateRoute({ children }) {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Navbar />
        <main className="section">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stats" element={<PrivateRoute><Stats /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/profile/edit" element={<PrivateRoute><EditProfile /></PrivateRoute>} /> {/* <- NUEVA */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/games/:gameId" element={<PrivateRoute><GameView /></PrivateRoute>} />
            <Route path="/games/:gameId/:farmType" element={<PrivateRoute>
              <GameChoose />
            </PrivateRoute>} />
            <Route path="*" element={<div className="text-center">404 – Página no encontrada</div>} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}
