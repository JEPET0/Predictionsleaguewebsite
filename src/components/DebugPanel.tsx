import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, Trash2, Database } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import * as api from '../utils/api';

export function DebugPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleViewData = async () => {
    try {
      setLoading(true);
      const result = await api.debugGetAllData();
      setData(result);
      toast.success('Datos cargados');
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('⚠️ ¿Estás seguro? Esto borrará TODOS los datos (jugadores, predicciones y resultados).\n\nDespués podrás registrar cuentas nuevas sin problemas.')) {
      return;
    }

    try {
      setLoading(true);
      await api.debugResetDatabase();
      setData(null);
      toast.success('✅ ¡Base de datos limpiada con éxito!', {
        description: 'Redirigiendo a la pantalla de registro...'
      });
      
      // Redirect to login page after reset
      setTimeout(() => {
        window.location.href = window.location.pathname;
      }, 2000);
    } catch (error) {
      console.error('Error resetting database:', error);
      toast.error('Error al resetear la base de datos', {
        description: String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Big warning at the top */}
        <div className="bg-orange-100 border-2 border-orange-400 rounded-xl p-6 mb-6 shadow-lg">
          <h2 className="text-2xl text-orange-900 mb-3">
            🚨 Limpieza de Base de Datos
          </h2>
          <div className="space-y-2 text-orange-800">
            <p className="text-lg">
              <strong>¿Por qué estás aquí?</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Si ves errores como "Este nombre ya está en uso"</li>
              <li>Si ves errores como "Contraseña incorrecta"</li>
              <li>Si hay jugadores antiguos de prueba (Ana, Carlos, Laura, etc.)</li>
            </ul>
            <p className="mt-4 text-lg">
              <strong>👇 Solución: Haz clic en "Resetear base de datos" abajo</strong>
            </p>
          </div>
        </div>

        <Card className="bg-white border-slate-200 shadow-md mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <AlertCircle className="w-6 h-6 text-orange-500" />
              Panel de Desarrollo
            </CardTitle>
            <CardDescription className="text-slate-600">
              Herramientas para gestionar la base de datos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <Button
                onClick={handleReset}
                disabled={loading}
                variant="destructive"
                className="rounded-lg h-14 text-lg"
                size="lg"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                🗑️ RESETEAR BASE DE DATOS (Borrar todo)
              </Button>
              
              <Button
                onClick={handleViewData}
                disabled={loading}
                variant="outline"
                className="rounded-lg"
              >
                <Database className="w-4 h-4 mr-2" />
                Ver datos actuales (opcional)
              </Button>
            </div>

            {data && (
              <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="text-sm mb-2 text-slate-700">Datos en la base de datos:</h3>
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">
                    <strong>Jugadores totales:</strong> {data.playerCount}
                  </p>
                  {data.players && data.players.length > 0 && (
                    <div>
                      <p className="text-sm text-slate-600 mb-2"><strong>Lista de jugadores:</strong></p>
                      <ul className="list-disc list-inside space-y-1">
                        {data.players.map((player: any, index: number) => (
                          <li key={index} className="text-sm text-slate-600">
                            {player.name} - {player.score} puntos
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <details className="mt-4">
                    <summary className="text-sm text-slate-600 cursor-pointer hover:text-slate-800">
                      Ver JSON completo
                    </summary>
                    <pre className="mt-2 p-3 bg-slate-100 rounded text-xs overflow-auto max-h-96">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <p className="text-sm text-green-800">
              ✅ <strong>Después de resetear:</strong> La página se recargará y podrás crear tu primera cuenta limpia.
              Todos tus amigos podrán registrarse sin problemas.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
