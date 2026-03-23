// app/score/ScoreClient.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteScore } from '../actions'; // Ajusta la ruta según dónde esté actions.ts
import { ChevronDown, ChevronUp, Trash2, Award } from 'lucide-react';

interface Score {
  id: number;
  points: number;
  category: string;
  createdAt: Date;
}

interface ScoreClientProps {
  categories: string[];
  scores: Score[];
}

export default function ScoreClient({ categories, scores }: ScoreClientProps) {
  const router = useRouter();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleDelete = async (scoreId: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este puntaje?")) return;
    
    setIsDeleting(scoreId);
    const result = await deleteScore(scoreId);
    
    if (result.success) {
      router.refresh(); // Recarga los datos del servidor sin recargar la página
    } else {
      alert("Hubo un error al eliminar.");
    }
    setIsDeleting(null);
  };

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        // Filtramos los scores que pertenecen a esta categoría
        const categoryScores = scores.filter(s => s.category === category);
        const hasTakenExam = categoryScores.length > 0;
        
        // Obtenemos el puntaje más alto (o 0 si no lo ha tomado)
        const highestScore = hasTakenExam 
          ? Math.max(...categoryScores.map(s => s.points)) 
          : 0;

        const isExpanded = expandedCategory === category;

        return (
          <div key={category} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Cabecera de la tarjeta (Siempre visible) */}
            <div 
              onClick={() => hasTakenExam && toggleCategory(category)}
              className={`p-6 flex items-center justify-between ${hasTakenExam ? 'cursor-pointer hover:bg-slate-50' : 'opacity-75'} transition-colors`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${hasTakenExam ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{category}</h3>
                  <p className="text-sm text-slate-500">
                    {hasTakenExam ? `${categoryScores.length} intento(s)` : 'Aún no realizado'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-slate-500 font-medium">Puntaje Más Alto</p>
                  <p className={`text-2xl font-black ${hasTakenExam ? 'text-green-600' : 'text-slate-400'}`}>
                    {highestScore} pts
                  </p>
                </div>
                
                {/* Icono de desplegar solo si hay historial */}
                {hasTakenExam && (
                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                  </div>
                )}
              </div>
            </div>

            {/* Menú desplegable (Historial de intentos) */}
            {isExpanded && hasTakenExam && (
              <div className="bg-slate-50 p-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-600 mb-3 px-2 uppercase tracking-wider">Historial de intentos</h4>
                <div className="space-y-2">
                  {categoryScores.map((score) => (
                    <div key={score.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{score.points} puntos</span>
                        <span className="text-xs text-slate-400">
                          {new Date(score.createdAt).toLocaleDateString()} a las {new Date(score.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => handleDelete(score.id)}
                        disabled={isDeleting === score.id}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Eliminar puntaje"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {categories.length === 0 && (
        <div className="text-center p-12 text-slate-500">
          No hay exámenes disponibles en el sistema.
        </div>
      )}
    </div>
  );
}