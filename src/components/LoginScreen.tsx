import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';
import { Sparkles, Trophy, Music, Star } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => void;
  onRegister: (username: string, password: string) => void;
}

export function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');
  const [showDebugLink, setShowDebugLink] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername.trim() && loginPassword) {
      onLogin(loginUsername.trim(), loginPassword);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerUsername.trim() && registerPassword && registerPassword === registerPasswordConfirm) {
      onRegister(registerUsername.trim(), registerPassword);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-yellow-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
      </div>

      {/* Floating stars */}
      <motion.div
        animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-40 right-1/4"
      >
        <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
      </motion.div>
      
      <motion.div
        animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute bottom-40 left-1/4"
      >
        <Star className="w-6 h-6 text-pink-300 fill-pink-300" />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block mb-6"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
              <Music className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <h1 className="text-6xl md:text-8xl mb-4 bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-lg">
            OT Predictions
          </h1>
          <h2 className="text-3xl md:text-4xl text-white flex items-center justify-center gap-3 drop-shadow-md">
            <Sparkles className="w-8 h-8 text-yellow-300" />
            2025
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </h2>
          <p className="text-white/90 mt-4 text-xl">¡Adivina quién será el triunfito! 🎤✨</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-md"
        >
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/20 backdrop-blur-sm border border-white/30">
              <TabsTrigger 
                value="login"
                className="data-[state=active]:bg-white data-[state=active]:text-purple-600 text-white"
              >
                Entrar
              </TabsTrigger>
              <TabsTrigger 
                value="register"
                className="data-[state=active]:bg-white data-[state=active]:text-purple-600 text-white"
              >
                Registrarse
              </TabsTrigger>
            </TabsList>
            
            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-white/50">
                <div className="mb-4">
                  <label htmlFor="login-username" className="block text-purple-900 mb-2">
                    Nombre de usuario
                  </label>
                  <Input
                    id="login-username"
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Tu nombre..."
                    className="border-purple-300 rounded-xl h-12 focus:ring-2 focus:ring-pink-500"
                    autoFocus
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="login-password" className="block text-purple-900 mb-2">
                    Contraseña
                  </label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Tu contraseña..."
                    className="border-purple-300 rounded-xl h-12 focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!loginUsername.trim() || !loginPassword}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Entrar 🎵
                </Button>
              </form>
            </TabsContent>
            
            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-white/50">
                <div className="mb-4">
                  <label htmlFor="register-username" className="block text-purple-900 mb-2">
                    Nombre de usuario
                  </label>
                  <Input
                    id="register-username"
                    type="text"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    placeholder="Elige un nombre único..."
                    className="border-purple-300 rounded-xl h-12 focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="register-password" className="block text-purple-900 mb-2">
                    Contraseña
                  </label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Crea una contraseña..."
                    className="border-purple-300 rounded-xl h-12 focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="register-password-confirm" className="block text-purple-900 mb-2">
                    Confirmar contraseña
                  </label>
                  <Input
                    id="register-password-confirm"
                    type="password"
                    value={registerPasswordConfirm}
                    onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                    placeholder="Repite tu contraseña..."
                    className="border-purple-300 rounded-xl h-12 focus:ring-2 focus:ring-pink-500"
                  />
                  {registerPassword && registerPasswordConfirm && registerPassword !== registerPasswordConfirm && (
                    <p className="text-red-600 text-sm mt-2">Las contraseñas no coinciden</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={!registerUsername.trim() || !registerPassword || registerPassword !== registerPasswordConfirm}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Crear cuenta 🌟
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
