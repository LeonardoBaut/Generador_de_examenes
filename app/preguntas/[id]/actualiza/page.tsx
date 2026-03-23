import React from 'react';
import prisma from "@/lib/prisma";
import Link from 'next/link';
import { redirect } from "next/navigation";
import { ArrowLeft, Save, FileEdit } from 'lucide-react';
// Asegúrate de importar la función de actualizar que hicimos en el primer paso
import { updateQuestion } from '@/app/actions'; 

// 1. Cambiamos el tipo de params para que sea una Promesa
export default async function ActualizarPreguntaPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  
  // 2. ¡EL TRUCO MÁGICO! Esperamos a que la promesa de params se resuelva
  const resolvedParams = await params;
  const questionId = parseInt(resolvedParams.id);

  // 2. Buscamos la pregunta en la base de datos
  const pregunta = await prisma.question.findUnique({
    where: { id: questionId },
  });

  // Si alguien escribe un ID que no existe en la URL, lo regresamos a la lista
  if (!pregunta) {
    redirect('/preguntas');
  }

  // 3. Preparamos nuestro Server Action con el ID de esta pregunta
  // Esto "inyecta" el ID como primer parámetro a tu función updateQuestion
  const updateAction = updateQuestion.bind(null, questionId);

  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans text-slate-800 p-6 md:p-12 flex flex-col items-center justify-center">
      
      <div className="w-full max-w-2xl">
        {/* Botón de regreso */}
        <Link 
          href="/preguntas" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0B1B32] font-medium transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a Preguntas
        </Link>

        {/* Tarjeta del Formulario */}
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">
          
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
              <FileEdit className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-[#0B1B32]">Editar Pregunta</h1>
            <p className="text-slate-500 mt-2 text-sm">
              Modifica los campos necesarios y guarda los cambios.
            </p>
          </div>

          {/* FORMULARIO MANUAL */}
          <form action={updateAction} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Campo: Categoría */}
              <div>
                <label htmlFor="category" className="block text-sm font-bold text-[#0B1B32] mb-2">Categoría</label>
                <input 
                  type="text" id="category" name="category" required
                  defaultValue={pregunta.category}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#F8FAFB] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B1B32]/20"
                />
              </div>

              {/* Campo: Dificultad */}
              <div>
                <label htmlFor="difficulty" className="block text-sm font-bold text-[#0B1B32] mb-2">Dificultad</label>
                <select 
                  id="difficulty" name="difficulty" 
                  defaultValue={pregunta.difficulty}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#F8FAFB] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B1B32]/20"
                >
                  <option value="Fácil">Fácil</option>
                  <option value="Medio">Medio</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>
            </div>

            {/* Campo: Texto de la pregunta */}
            <div>
              <label htmlFor="questionText" className="block text-sm font-bold text-[#0B1B32] mb-2">Pregunta</label>
              <textarea 
                id="questionText" name="questionText" required rows={3}
                defaultValue={pregunta.questionText}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#F8FAFB] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B1B32]/20 resize-none"
              ></textarea>
            </div>

            {/* Campo: Opciones separadas por coma */}
            <div>
              <label htmlFor="options" className="block text-sm font-bold text-[#0B1B32] mb-2">
                Opciones (Separadas por coma)
              </label>
              <input 
                type="text" id="options" name="options" required
                // Prisma guarda un arreglo ["A", "B", "C"], lo unimos con join para mostrarlo como string
                defaultValue={pregunta.options.join(", ")} 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#F8FAFB] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B1B32]/20"
              />
              <p className="text-xs text-slate-400 mt-1">Ejemplo: Madrid, Barcelona, Sevilla, Valencia</p>
            </div>

            {/* Campo: Respuesta Correcta */}
            <div>
              <label htmlFor="correctAnswer" className="block text-sm font-bold text-[#0B1B32] mb-2">Respuesta Correcta</label>
              <input 
                type="text" id="correctAnswer" name="correctAnswer" required
                defaultValue={pregunta.correctAnswer}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#F8FAFB] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B1B32]/20"
              />
              <p className="text-xs text-slate-400 mt-1">Debe coincidir exactamente con una de las opciones escritas arriba.</p>
            </div>

            {/* Botón Guardar */}
            <button
              type="submit"
              className="w-full bg-[#0B1B32] text-white py-3 px-4 mt-4 rounded-xl text-base font-medium hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Guardar Cambios
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}