import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Trophy, UserX, AlertCircle, Users, Check, X } from 'lucide-react';

interface Prediction {
  winner: string;
  eliminated: string;
  proposed: string[];
  nominated: string[];
}

interface GalaResult {
  galaNumber: number;
  results: Prediction;
  userPrediction?: Prediction;
}

interface ResultsScreenProps {
  galaResults: GalaResult[];
}

export function ResultsScreen({ galaResults }: ResultsScreenProps) {
  const calculateGalaPoints = (prediction: Prediction, result: Prediction) => {
    let points = 0;
    const details = {
      winner: false,
      eliminated: false,
      proposed: 0,
      nominated: 0,
    };

    if (prediction.winner === result.winner) {
      points += 100;
      details.winner = true;
    }
    if (prediction.eliminated === result.eliminated) {
      points += 75;
      details.eliminated = true;
    }
    prediction.proposed.forEach(p => {
      if (result.proposed.includes(p)) {
        points += 25;
        details.proposed++;
      }
    });
    prediction.nominated.forEach(n => {
      if (result.nominated.includes(n)) {
        points += 50;
        details.nominated++;
      }
    });

    return { points, details };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4 md:p-8 pb-24 md:pb-8 md:pt-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl mb-2 bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent drop-shadow-lg">
            📊 Mis Resultados
          </h1>
          <p className="text-white/90 text-xl">Revisa tus predicciones y aciertos ✨</p>
        </motion.div>

        <div className="space-y-6">
          {galaResults.length === 0 ? (
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/50 shadow-xl">
              <CardContent className="p-8 text-center text-purple-700">
                Aún no hay resultados disponibles 🎵
              </CardContent>
            </Card>
          ) : (
            galaResults.map((gala, index) => {
              if (!gala.userPrediction) {
                return (
                  <motion.div
                    key={gala.galaNumber}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/50 shadow-xl">
                      <CardHeader>
                        <CardTitle className="text-purple-900">
                          Gala {gala.galaNumber}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-purple-600">
                        No hiciste predicción para esta gala 😢
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              }

              const { points, details } = calculateGalaPoints(gala.userPrediction, gala.results);

              return (
                <motion.div
                  key={gala.galaNumber}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/50 shadow-xl hover:shadow-2xl transition-all">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-purple-900">
                          🎤 Gala {gala.galaNumber}
                        </CardTitle>
                        <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-300 px-4 py-2 rounded-lg">
                          ⚡ {points} puntos
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Favorite of the Week */}
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                          <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-yellow-700 mb-1">⭐ Favorito de la Semana</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-slate-800">{gala.userPrediction.winner}</span>
                            {details.winner ? (
                              <Badge className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
                                <Check className="w-3 h-3" /> +100 pts
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
                                <X className="w-3 h-3" /> Era {gala.results.winner}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Eliminated */}
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-red-50 to-pink-50 border border-red-200">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                          <UserX className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-red-700 mb-1">👋 Expulsado</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-slate-800">{gala.userPrediction.eliminated}</span>
                            {details.eliminated ? (
                              <Badge className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
                                <Check className="w-3 h-3" /> +75 pts
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
                                <X className="w-3 h-3" /> Era {gala.results.eliminated}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Proposed */}
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                          <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-orange-700 mb-2">⚠️ Propuestos</p>
                          <div className="flex flex-wrap gap-2">
                            {gala.userPrediction.proposed.map(person => {
                              const isCorrect = gala.results.proposed.includes(person);
                              return (
                                <Badge
                                  key={person}
                                  className={
                                    isCorrect
                                      ? 'bg-green-100 text-green-700 border-green-200'
                                      : 'bg-red-100 text-red-700 border-red-200'
                                  }
                                >
                                  {person} {isCorrect ? '✓' : '✗'}
                                </Badge>
                              );
                            })}
                          </div>
                          {details.proposed > 0 && (
                            <p className="text-sm text-green-600 mt-2">
                              +{details.proposed * 25} puntos ({details.proposed} aciertos)
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Nominated */}
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-purple-700 mb-2">🎯 Nominados</p>
                          <div className="flex flex-wrap gap-2">
                            {gala.userPrediction.nominated.map(person => {
                              const isCorrect = gala.results.nominated.includes(person);
                              return (
                                <Badge
                                  key={person}
                                  className={
                                    isCorrect
                                      ? 'bg-green-100 text-green-700 border-green-200'
                                      : 'bg-red-100 text-red-700 border-red-200'
                                  }
                                >
                                  {person} {isCorrect ? '✓' : '✗'}
                                </Badge>
                              );
                            })}
                          </div>
                          {details.nominated > 0 && (
                            <p className="text-sm text-green-600 mt-2">
                              +{details.nominated * 50} puntos ({details.nominated} aciertos)
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
