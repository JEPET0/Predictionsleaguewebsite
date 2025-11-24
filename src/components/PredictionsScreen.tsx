import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { motion } from 'motion/react';
import { Save, Trophy, UserX, AlertCircle, Users, Calendar, Lock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ContestantSelector } from './ContestantSelector';
import { CONTESTANTS } from '../utils/contestants';
import { getPredictionsLock } from '../utils/api';
import maxDecor from '../assets/max-decor.jpg';

interface Prediction {
  winner: string;
  eliminated: string;
  proposed: string[];
  nominated: string[];
}

interface PredictionsScreenProps {
  contestants: string[];
  currentGala: number;
  onSavePredictions: (predictions: Prediction, gala: number) => void;
  existingPredictions?: Prediction;
  allPredictions: { [gala: number]: Prediction };
}

export function PredictionsScreen({ 
  contestants, 
  currentGala, 
  onSavePredictions,
  existingPredictions,
  allPredictions
}: PredictionsScreenProps) {
  const [selectedGala, setSelectedGala] = useState(currentGala);
  const [winner, setWinner] = useState(existingPredictions?.winner || '');
  const [eliminated, setEliminated] = useState(existingPredictions?.eliminated || '');
  const [proposed, setProposed] = useState<string[]>(existingPredictions?.proposed || []);
  const [nominated, setNominated] = useState<string[]>(existingPredictions?.nominated || []);
  const [lockStatus, setLockStatus] = useState<{ [gala: number]: boolean }>({});
  const [isLocked, setIsLocked] = useState(false);

  // Update predictions when changing gala
  useEffect(() => {
    const galaPredictions = allPredictions[selectedGala];
    setWinner(galaPredictions?.winner || '');
    setEliminated(galaPredictions?.eliminated || '');
    setProposed(galaPredictions?.proposed || []);
    setNominated(galaPredictions?.nominated || []);
  }, [selectedGala, allPredictions]);

  // Update lock status
  useEffect(() => {
    setIsLocked(lockStatus[selectedGala] || false);
  }, [selectedGala, lockStatus]);

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
    
    // Refresh lock status every 10 seconds
    const interval = setInterval(loadLockStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSave = () => {
    if (isLocked) {
      toast.error('🔒 Las predicciones están cerradas para esta gala');
      return;
    }

    if (!winner || !eliminated || proposed.length === 0 || nominated.length === 0) {
      toast.error('Por favor, completa todas las predicciones');
      return;
    }

    onSavePredictions({ winner, eliminated, proposed, nominated }, selectedGala);
    toast.success(`¡Predicciones guardadas para Gala ${selectedGala}! 🎉`, {
      description: 'Mucha suerte en la gala'
    });
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

  const totalPoints = 375;

  const galas = Array.from({ length: 8 }, (_, i) => i + 8); // Galas 8-15

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4 md:p-8 pb-24 md:pb-8 md:pt-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl mb-4 text-center bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent drop-shadow-lg">
            🎤 Predicciones
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
                          Gala {gala} {gala === currentGala && '(Actual)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lock Alert */}
          {isLocked && (
            <Alert className="bg-red-50 border-red-300 max-w-md mx-auto mt-4">
              <Lock className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-900">Predicciones cerradas</AlertTitle>
              <AlertDescription className="text-red-700">
                Las predicciones están cerradas para esta gala. Ya no puedes enviar o modificar tus predicciones.
              </AlertDescription>
            </Alert>
          )}
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

          {/* Decorative separator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="flex justify-center my-2"
          >
            <img src={maxDecor} alt="Max en OT 2025" className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-2xl border-4 border-white/70 object-cover hover:scale-110 transition-transform" />
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

          {/* Decorative separator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="flex justify-center my-2"
          >
            <img src={maxDecor} alt="Max en OT 2025" className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-2xl border-4 border-white/70 object-cover hover:scale-110 transition-transform" />
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

          {/* Decorative separator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            className="flex justify-center my-2"
          >
            <img src={maxDecor} alt="Max en OT 2025" className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-2xl border-4 border-white/70 object-cover hover:scale-110 transition-transform" />
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

        {/* Save button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="sticky bottom-4 md:bottom-8"
        >
          <Card className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 border-0 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-white">
                  <p className="text-sm text-white/80">Puntos en juego</p>
                  <p className="text-3xl">⚡ {totalPoints} puntos</p>
                </div>
              </div>
              <Button
                onClick={handleSave}
                className="w-full h-14 rounded-xl bg-white text-purple-600 hover:bg-white/90 shadow-lg hover:scale-105 transition-all"
                size="lg"
              >
                <Save className="w-5 h-5 mr-2" />
                Guardar predicciones ✨
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
