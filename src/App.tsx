import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { PredictionsScreen } from './components/PredictionsScreen';
import { RankingScreen } from './components/RankingScreen';
import { AdminScreen } from './components/AdminScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { DebugPanel } from './components/DebugPanel';
import { Navigation } from './components/Navigation';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import * as api from './utils/api';

interface Prediction {
  winner: string;
  eliminated: string;
  proposed: string[];
  nominated: string[];
}

interface Player {
  name: string;
  score: number;
  predictions: { [gala: number]: Prediction };
}

interface GalaResults {
  [gala: number]: Prediction;
}

const MOCK_CONTESTANTS = [
  'María', 'Lucas', 'Sofía', 'Diego', 'Carmen', 'Pablo',
  'Ana', 'Javier', 'Laura', 'Miguel', 'Elena', 'David'
];

const CURRENT_GALA = 10;

// Lista de administradores - añade aquí los nombres de usuario que quieres que sean admin
const ADMIN_USERS = ['Victorr'];

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'predictions' | 'ranking' | 'admin' | 'results' | 'debug'>('predictions');
  const [players, setPlayers] = useState<Player[]>([]);
  const [galaResults, setGalaResults] = useState<GalaResults>({});
  const [loading, setLoading] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  // Check for debug mode in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('debug') === 'true') {
      setDebugMode(true);
    }
  }, []);

  // Load data from Supabase
  useEffect(() => {
    const savedUser = localStorage.getItem('otCurrentUser');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [playersData, resultsData] = await Promise.all([
        api.getPlayers(),
        api.getGalaResults()
      ]);
      setPlayers(playersData);
      setGalaResults(resultsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      setLoading(true);
      // Login the player
      await api.loginPlayer(username, password);
      
      // Reload all players to ensure sync
      await loadData();
      
      setCurrentUser(username);
      localStorage.setItem('otCurrentUser', username);
      
      toast.success(`¡Bienvenido ${username}! 🎉`);
    } catch (error: any) {
      console.error('Error logging in:', error);
      const errorMessage = error.message || 'Error al iniciar sesión';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username: string, password: string) => {
    try {
      setLoading(true);
      // Register the player
      await api.registerPlayer(username, password);
      
      // Reload all players to ensure sync
      await loadData();
      
      setCurrentUser(username);
      localStorage.setItem('otCurrentUser', username);
      
      toast.success(`¡Cuenta creada! Bienvenido ${username}! 🎉`);
    } catch (error: any) {
      console.error('Error registering:', error);
      const errorMessage = error.message || 'Error al registrarse';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('otCurrentUser');
    setCurrentScreen('predictions');
  };

  const handleSavePredictions = async (predictions: Prediction, gala: number) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const updatedPlayer = await api.savePrediction(currentUser, gala, predictions);
      
      // Update local state
      setPlayers(prev => prev.map(p => p.name === currentUser ? updatedPlayer : p));
      
      toast.success(`¡Predicciones guardadas para Gala ${gala}! 🎉`, {
        description: 'Mucha suerte en la gala'
      });
    } catch (error) {
      console.error('Error saving predictions:', error);
      toast.error('Error al guardar predicciones. Intenta refrescar la página.');
      
      // Try to reload data in case of desync
      loadData();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateResults = async (results: Prediction, gala: number) => {
    try {
      setLoading(true);
      const updatedResults = await api.updateGalaResults(gala, results);
      
      // Reload all players to get updated scores
      const playersData = await api.getPlayers();
      setPlayers(playersData);
      setGalaResults(updatedResults);
      
      toast.success(`¡Resultados de Gala ${gala} actualizados! 🎉`, {
        description: 'Los puntos se han calculado automáticamente'
      });
    } catch (error) {
      console.error('Error updating results:', error);
      toast.error('Error al actualizar resultados');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUserPredictions = (): { [gala: number]: Prediction } => {
    const currentPlayer = players.find(p => p.name === currentUser);
    return currentPlayer?.predictions || {};
  };

  const getUserGalaResults = () => {
    const currentPlayer = players.find(p => p.name === currentUser);
    if (!currentPlayer) return [];

    return Object.entries(galaResults).map(([galaNumber, results]) => ({
      galaNumber: parseInt(galaNumber),
      results,
      userPrediction: currentPlayer.predictions[parseInt(galaNumber)]
    }));
  };

  const isAdmin = currentUser ? ADMIN_USERS.includes(currentUser) : false;

  // Debug mode - accessible without login
  if (debugMode && !currentUser) {
    return (
      <div className="min-h-screen">
        <div className="bg-white border-b border-slate-200 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-xl text-slate-800">Panel de Debug (Sin autenticación)</h1>
            <Button
              onClick={() => {
                setDebugMode(false);
                window.history.replaceState({}, '', window.location.pathname);
              }}
              variant="outline"
              className="rounded-lg"
            >
              Volver al Login
            </Button>
          </div>
        </div>
        <DebugPanel />
        <Toaster />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} onRegister={handleRegister} />
        <Toaster />
      </>
    );
  }

  if (loading && players.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando datos...</p>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onLogout={handleLogout}
        isAdmin={isAdmin}
      />
      
      <div className="md:pt-16 pb-16 md:pb-0">
        {currentScreen === 'predictions' && (
          <PredictionsScreen
            contestants={MOCK_CONTESTANTS}
            currentGala={CURRENT_GALA}
            onSavePredictions={handleSavePredictions}
            existingPredictions={getCurrentUserPredictions()[CURRENT_GALA]}
            allPredictions={getCurrentUserPredictions()}
          />
        )}
        
        {currentScreen === 'ranking' && (
          <RankingScreen players={players} />
        )}

        {currentScreen === 'results' && (
          <ResultsScreen galaResults={getUserGalaResults()} />
        )}
        
        {currentScreen === 'admin' && isAdmin && (
          <AdminScreen
            contestants={MOCK_CONTESTANTS}
            currentGala={CURRENT_GALA}
            onUpdateResults={handleUpdateResults}
            allResults={galaResults}
          />
        )}

        {currentScreen === 'debug' && isAdmin && (
          <DebugPanel />
        )}
      </div>
      
      {loading && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-700">Guardando...</span>
        </div>
      )}
      
      <Toaster />
    </div>
  );
}
