import { Button } from './ui/button';
import { Home, Trophy, BarChart3, Settings, LogOut, CheckCircle, Wrench } from 'lucide-react';

interface NavigationProps {
  currentScreen: 'predictions' | 'ranking' | 'admin' | 'results' | 'debug';
  onNavigate: (screen: 'predictions' | 'ranking' | 'admin' | 'results' | 'debug') => void;
  onLogout: () => void;
  isAdmin?: boolean;
}

export function Navigation({ currentScreen, onNavigate, onLogout, isAdmin }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 backdrop-blur-lg border-t-2 border-white/20 md:top-0 md:bottom-auto md:border-b-2 md:border-t-0 shadow-xl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md">
              <Trophy className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-white hidden md:inline">OT Predictions 2025</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('predictions')}
              className={`rounded-lg ${
                currentScreen === 'predictions'
                  ? 'bg-white text-purple-700 shadow-md'
                  : 'text-white hover:text-white hover:bg-white/20'
              }`}
            >
              <Home className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Predicciones</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('ranking')}
              className={`rounded-lg ${
                currentScreen === 'ranking'
                  ? 'bg-white text-purple-700 shadow-md'
                  : 'text-white hover:text-white hover:bg-white/20'
              }`}
            >
              <BarChart3 className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Ranking</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('results')}
              className={`rounded-lg ${
                currentScreen === 'results'
                  ? 'bg-white text-purple-700 shadow-md'
                  : 'text-white hover:text-white hover:bg-white/20'
              }`}
            >
              <CheckCircle className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Resultados</span>
            </Button>
            
            {isAdmin && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('admin')}
                  className={`rounded-lg ${
                    currentScreen === 'admin'
                      ? 'bg-white text-purple-700 shadow-md'
                      : 'text-white hover:text-white hover:bg-white/20'
                  }`}
                >
                  <Settings className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Admin</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('debug')}
                  className={`rounded-lg ${
                    currentScreen === 'debug'
                      ? 'bg-white text-orange-700 shadow-md'
                      : 'text-white hover:text-white hover:bg-white/20'
                  }`}
                >
                  <Wrench className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Debug</span>
                </Button>
              </>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-white hover:text-white hover:bg-white/20 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
