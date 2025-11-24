import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { motion } from 'motion/react';
import { RefreshCw, Trophy, UserX, AlertCircle, Users, Calendar, Lock, Unlock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ContestantSelector } from './ContestantSelector';
import { CONTESTANTS } from '../utils/contestants';
import { togglePredictionsLock, getPredictionsLock } from '../utils/api';
import contestant1 from 'figma:asset/d35371867c591f8d45aded213eebe74bb15bfa98.png';
import contestant2 from 'figma:asset/f195bdd615b59988ab52e2eb2afa3cdd0a1d8b94.png';
import contestant3 from 'figma:asset/9ccaa18ce9e81d3dba72e47287042ffeadef2505.png';

interface Results {
  winner: string;
  eliminated: string;
  proposed: string[];
  nominated: string[];
}

interface AdminScreenProps {
  contestants: string[];
  currentGala: number;
  onUpdateResults: (results: Results, gala: number) => void;
  allResults: { [gala: number]: Results };
}

export function AdminScreen({ contestants, currentGala, onUpdateResults, allResults }: AdminScreenProps) {
  const [selectedGala, setSelectedGala] = useState(currentGala);
  const [winner, setWinner] = useState('');
  const [eliminated, setEliminated] = useState('');
  const [proposed, setProposed] = useState<string[]>([]);
  const [nominated, setNominated] = useState<string[]>([]);
  const [lockStatus, setLockStatus] = useState<{ [gala: number]: boolean }>({});
  const [isLocked, setIsLocked] = useState(false);

  // Load existing results and lock status when changing gala
  useEffect(() => {
    const galaResults = allResults[selectedGala];
    setWinner(galaResults?.winner || '');
    setEliminated(galaResults?.eliminated || '');
    setProposed(galaResults?.proposed || []);
    setNominated(galaResults?.nominated || []);
    setIsLocked(lockStatus[selectedGala] || false);
  }, [selectedGala, allResults, lockStatus]);

  // Load lock status on mount
  useEffect(() => {
    const loadLockStatus = async () => {
      try {
        const status = await getPredictionsLock();
        setLockStatus(status);
        setIsLocked(status[selectedGala] || false);
      } catch (error) {
        console.error('Error loading lock status:', error);
      }
    };
    loadLockStatus();
  }, []);

  const handleUpdate = () => {
    if (!winner || !eliminated || proposed.length === 0 || nominated.length === 0) {
      toast.error('Por favor, completa todos los resultados');
      return;
    }

    onUpdateResults({ winner, eliminated, proposed, nominated }, selectedGala);
    toast.success(`¡Resultados de Gala ${selectedGala} actualizados! 🎉`, {
      description: 'Los puntos se han calculado automáticamente'
    });
  };

  const handleToggleLock = async () => {
    try {
      const newLockStatus = await togglePredictionsLock(selectedGala, !isLocked);
      setLockStatus(newLockStatus);
      setIsLocked(!isLocked);
      toast.success(
        !isLocked 
          ? `🔒 Predicciones cerradas para Gala ${selectedGala}` 
          : `🔓 Predicciones abiertas para Gala ${selectedGala}`
      );
    } catch (error) {
      toast.error('Error al cambiar el estado de las predicciones');
      console.error('Error toggling lock:', error);
    }
  };

  const handleProposedSelect = (name: string) => {
    setProposed(prev => 
      prev.includes(name) 
        ? prev.filter(c => c !== name)
        : [...prev, name]
    );
  };

  const handleNominatedSelect = (name: string) => {
    setNominated(prev => 
      prev.includes(name) 
        ? prev.filter(c => c !== name)
        : prev.length < 2 ? [...prev, name] : prev
    );
  };

  const galas = Array.from({ length: 8 }, (_, i) => i + 8); // Galas 8-15
  const galaHasResults = !!allResults[selectedGala];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4 md:p-8 pb-24 md:pb-8 md:pt-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl mb-4 text-center bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent drop-shadow-lg">
            🎬 Panel Admin
          </h1>
          
          {/* Gala Selector */}
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/50 shadow-xl max-w-md mx-auto">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-purple-900 mb-1">Selecciona la gala</p>
                  <Select value={selectedGala.toString()} onValueChange={(v) => setSelectedGala(parseInt(v))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona gala" />
                    </SelectTrigger>
                    <SelectContent>
                      {galas.map((gala) => (
                        <SelectItem key={gala} value={gala.toString()}>
                          Gala {gala} {gala === currentGala && '(Actual)'} {allResults[gala] && '✓'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {galaHasResults && (
                <p className="text-xs text-green-600 mt-2">✓ Esta gala ya tiene resultados guardados</p>
              )}
            </CardContent>
          </Card>

          {/* Predictions Lock Toggle */}
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/50 shadow-xl max-w-md mx-auto mt-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${isLocked ? 'from-red-500 to-orange-500' : 'from-green-500 to-emerald-500'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    {isLocked ? <Lock className="w-5 h-5 text-white" /> : <Unlock className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <Label htmlFor="lock-switch" className="text-sm font-medium cursor-pointer">
                      {isLocked ? '🔒 Predicciones cerradas' : '🔓 Predicciones abiertas'}
                    </Label>
                    <p className="text-xs text-gray-600">
                      {isLocked ? 'Los usuarios no pueden enviar predicciones' : 'Los usuarios pueden enviar predicciones'}
                    </p>
                  </div>
                </div>
                <Switch
                  id="lock-switch"
                  checked={isLocked}
                  onCheckedChange={handleToggleLock}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6 mb-8">
          {/* Winner */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-yellow-100 to-yellow-50 border-2 border-yellow-300 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-900">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center shadow-md">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  Favorito de la Semana ⭐
                </CardTitle>
                <CardDescription className="text-yellow-700">
                  💯 100 puntos · Haz click en una foto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContestantSelector
                  contestants={CONTESTANTS}
                  selectedName={winner}
                  onSelect={setWinner}
                  mode="single"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Separator Image 1 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="flex justify-center my-2"
          >
            <img src={contestant1} alt="" className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-2xl border-4 border-white/70 object-cover hover:scale-110 transition-transform" />
          </motion.div>

          {/* Eliminated */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-red-100 to-red-50 border-2 border-red-300 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-900">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                    <UserX className="w-5 h-5 text-white" />
                  </div>
                  Expulsado 👋
                </CardTitle>
                <CardDescription className="text-red-700">
                  75 puntos · Haz click en una foto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContestantSelector
                  contestants={CONTESTANTS}
                  selectedName={eliminated}
                  onSelect={setEliminated}
                  mode="single"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Separator Image 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="flex justify-center my-2"
          >
            <img src={contestant2} alt="" className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-2xl border-4 border-white/70 object-cover hover:scale-110 transition-transform" />
          </motion.div>

          {/* Proposed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-orange-100 to-orange-50 border-2 border-orange-300 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-900">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-md">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  Propuestos a nominación ⚠️
                </CardTitle>
                <CardDescription className="text-orange-700">
                  25 puntos cada uno · Selecciona hasta 4
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContestantSelector
                  contestants={CONTESTANTS}
                  selectedNames={proposed}
                  onSelect={handleProposedSelect}
                  mode="multiple"
                  maxSelections={4}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Separator Image 3 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            className="flex justify-center my-2"
          >
            <img src={contestant3} alt="" className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-2xl border-4 border-white/70 object-cover hover:scale-110 transition-transform" />
          </motion.div>

          {/* Nominated */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-purple-100 to-purple-50 border-2 border-purple-300 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  Nominados (máximo 2) 🎯
                </CardTitle>
                <CardDescription className="text-purple-700">
                  50 puntos cada uno · Selecciona hasta 2
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContestantSelector
                  contestants={CONTESTANTS}
                  selectedNames={nominated}
                  onSelect={handleNominatedSelect}
                  mode="multiple"
                  maxSelections={2}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Update button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={handleUpdate}
            className="w-full h-14 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white shadow-2xl hover:scale-105 transition-all"
            size="lg"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Actualizar ranking ✨
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
