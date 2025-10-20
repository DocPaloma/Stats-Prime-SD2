import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile'; // <- NUEVO
import PasswordResetBySecret from './pages/ForgotPassword';
import Stats from './pages/Stats';
import GameView from './pages/Game';
import GameChoose from './pages/GenshinOrWuWa';
import GenshinStats from './pages/GenshinStats';
import FarmEventRegister from './pages/FarmEventForm';
import Footer from './components/Footer';
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
            <Route path="/forgot-password" element={<PasswordResetBySecret />} />

            {/* Rutas del juego */}
            <Route path="/games/:gameId" element={<PrivateRoute><GameView /></PrivateRoute>} />
            <Route path="/games/genshin/world-bosses" element={<GenshinStats farmType="JEFE" />} />
            <Route path="/games/genshin/weekly-bosses" element={<GenshinStats farmType="JEFE-SEMANAL" />} />
            <Route path="/games/genshin/domains" element={<GenshinStats farmType="DOMINIO" />} />
            
            {/* Nueva ruta para registrar eventos */}
            <Route path="/farm-event/register" element={<PrivateRoute><FarmEventRegister /></PrivateRoute>} />
            
            <Route path="*" element={<div className="text-center">404 – Página no encontrada</div>} />

          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
