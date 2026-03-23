import React from 'react';
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, BrainCircuit } from 'lucide-react';
import { deleteQuestion } from "@/app/actions"; // Asegúrate de que esta ruta apunte a tu archivo de Server Actions

export default async function PreguntasPage() {
  // Obtenemos todas las preguntas de la base de datos, ordenadas por las más recientes
  const preguntas = await prisma.question.findMany({
    orderBy: {
      id: 'desc'
    }
  });

  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans text-slate-800 p-6 md:p-12">
      
      {/* CABECERA Y BOTONES PRINCIPALES */}
      <div className="max-w-[1400px] mx-auto mb-8">
        
        {/* Botón para regresar al inicio */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0B1B32] font-medium transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#0B1B32]">Banco de Preguntas</h1>
            <p className="text-slate-600 mt-2">
              Gestiona todas las preguntas de tus exámenes. Total: {preguntas.length} preguntas.
            </p>
          </div>

          {/* Botón Grande para Agregar Pregunta */}
          <Link 
            href="/preguntas/new" // Cambia esto a la ruta de tu formulario de creación
            className="bg-[#0B1B32] text-white px-6 py-4 rounded-xl text-base font-medium hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Agregar Nueva Pregunta
          </Link>
        </div>
      </div>

      {/* CUADRÍCULA DE PREGUNTAS */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {preguntas.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl shadow-sm text-center border border-slate-100">
            <BrainCircuit className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#0B1B32]">No hay preguntas</h3>
            <p className="text-slate-500">Comienza agregando tu primera pregunta al sistema.</p>
          </div>
        ) : (
          preguntas.map((pregunta) => {
            // Preparamos la función de borrado con el ID específico de esta pregunta
            const deleteAction = deleteQuestion.bind(null, pregunta.id);

            return (
              <div key={pregunta.id} className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between border border-slate-100 hover:shadow-md transition-shadow">
                
                {/* Contenido de la Tarjeta */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {pregunta.category}
                    </span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      pregunta.difficulty === 'Fácil' ? 'text-green-600' :
                      pregunta.difficulty === 'Medio' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {pregunta.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-[#0B1B32] mb-4 leading-snug">
                    {pregunta.questionText}
                  </h3>

                  {/* Mostramos las opciones de forma discreta, sin revelar la correcta */}
                  <ul className="text-sm text-slate-600 space-y-1 mb-6">
                    {pregunta.options.map((opcion, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-slate-400 mt-[2px]">•</span> 
                        {opcion}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Botones de Acción (Update / Delete) */}
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100">
                  
                  {/* Botón de Actualizar */}
                  <Link 
                    href={`/preguntas/${pregunta.id}/actualiza`} // Ruta dinámica a tu formulario de edición
                    className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </Link>

                  {/* Botón de Eliminar (Usando Server Actions directamente) */}
                  <form action={deleteQuestion.bind(null,pregunta.id)} className="flex-1">
                    <button 
                      type="submit"
                      className="w-full bg-red-50 text-red-600 py-2.5 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                      // Opcional: Un pequeño confirm para evitar borrados por error
                      
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </form>

                </div>
              </div>
            );
          })
        )}

      </div>
    </div>
  );
}