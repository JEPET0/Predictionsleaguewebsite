import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Trophy, Medal, Award, Star } from 'lucide-react';

interface Player {
  name: string;
  score: number;
}

interface RankingScreenProps {
  players: Player[];
}

export function RankingScreen({ players }: RankingScreenProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 1:
        return <Medal className="w-8 h-8 text-slate-400" />;
      case 2:
        return <Award className="w-8 h-8 text-orange-500" />;
      default:
        return null;
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 0:
        return 'border-yellow-400 bg-gradient-to-r from-yellow-100 to-amber-100';
      case 1:
        return 'border-slate-400 bg-gradient-to-r from-slate-100 to-gray-100';
      case 2:
        return 'border-orange-400 bg-gradient-to-r from-orange-100 to-amber-100';
      default:
        return 'border-white/50 bg-white/90 backdrop-blur-sm';
    }
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
            🏆 Ranking General
          </h1>
          <p className="text-white/90 text-xl">¿Quién será el mejor predictor? 🌟</p>
        </motion.div>

        {/* Top 3 Podium */}
        {sortedPlayers.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12 flex items-end justify-center gap-4 md:gap-8"
          >
            {/* Second Place */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-4">
                <Avatar className="w-20 h-20 border-4 border-slate-300 shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-slate-300 to-slate-400 text-white text-2xl">
                    {sortedPlayers[1].name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2 bg-slate-300 rounded-full p-2">
                  <Medal className="w-5 h-5 text-slate-700" />
                </div>
              </div>
              <div className="bg-gradient-to-t from-slate-200 to-white border-2 border-slate-300 rounded-t-2xl px-6 py-8 text-center shadow-lg">
                <p className="text-slate-800 mb-2">{sortedPlayers[1].name}</p>
                <p className="text-2xl text-slate-700">{sortedPlayers[1].score}</p>
                <p className="text-sm text-slate-500">puntos</p>
              </div>
            </motion.div>

            {/* First Place */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center -mt-8"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                className="mb-2"
              >
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
              </motion.div>
              <div className="relative mb-4">
                <Avatar className="w-24 h-24 border-4 border-yellow-400 shadow-xl shadow-yellow-200">
                  <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-amber-500 text-white text-3xl">
                    {sortedPlayers[0].name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
                  <Trophy className="w-6 h-6 text-yellow-800" />
                </div>
              </div>
              <div className="bg-gradient-to-t from-yellow-300 to-yellow-100 border-2 border-yellow-400 rounded-t-2xl px-6 py-12 text-center shadow-xl">
                <p className="text-yellow-900 mb-2">{sortedPlayers[0].name}</p>
                <p className="text-3xl text-yellow-900">{sortedPlayers[0].score}</p>
                <p className="text-sm text-yellow-700">puntos</p>
              </div>
            </motion.div>

            {/* Third Place */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-4">
                <Avatar className="w-20 h-20 border-4 border-orange-400 shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-500 text-white text-2xl">
                    {sortedPlayers[2].name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2 bg-orange-400 rounded-full p-2">
                  <Award className="w-5 h-5 text-orange-800" />
                </div>
              </div>
              <div className="bg-gradient-to-t from-orange-200 to-orange-100 border-2 border-orange-400 rounded-t-2xl px-6 py-6 text-center shadow-lg">
                <p className="text-orange-900 mb-2">{sortedPlayers[2].name}</p>
                <p className="text-2xl text-orange-900">{sortedPlayers[2].score}</p>
                <p className="text-sm text-orange-700">puntos</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Full Ranking */}
        <div className="space-y-3">
          {sortedPlayers.map((player, index) => (
            <motion.div
              key={player.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className={`${getRankColor(index)} border-2 shadow-xl hover:shadow-2xl transition-all hover:scale-105`}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(index) || (
                        <span className="text-2xl text-purple-600">#{index + 1}</span>
                      )}
                    </div>
                    <Avatar className="w-12 h-12 border-2 border-purple-300">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        {player.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-slate-900">{player.name}</p>
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-300 px-4 py-2 rounded-lg">
                      {player.score} pts
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
