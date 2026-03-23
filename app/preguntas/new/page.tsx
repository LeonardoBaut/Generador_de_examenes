"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, BrainCircuit } from 'lucide-react';
import { useFormStatus } from 'react-dom';
// Asegúrate de que esta ruta apunte correctamente a tu archivo actions.ts
import { createGeneratedQuestion } from '@/app/actions'; 

// 1. Creamos un subcomponente para el botón. 
// Esto es necesario en Next.js para que useFormStatus sepa cuándo el formulario está enviando datos.
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full py-3 px-4 rounded-xl text-base font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
        pending 
          ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
          : 'bg-[#0B1B32] text-white hover:bg-slate-800 shadow-sm hover:shadow-md'
      }`}
    >
      {pending ? (
        <>
          {/* Un pequeño spinner animado de carga */}
          <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          Generando con IA...
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5 text-yellow-400" />
          Generar Pregunta Mágicamente
        </>
      )}
    </button>
  );
}

// 2. La página principal
export default function NuevaPreguntaPage() {
  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans text-slate-800 p-6 md:p-12 flex flex-col items-center justify-center">
      
      <div className="w-full max-w-lg">
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
              <BrainCircuit className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-[#0B1B32]">Nueva Pregunta</h1>
            <p className="text-slate-500 mt-2 text-sm">
              Deja que la IA redacte una pregunta perfecta. Solo dinos el tema y qué tan difícil debe ser.
            </p>
          </div>

          {/* FORMULARIO */}
          <form action={createGeneratedQuestion} className="space-y-6">
            
            {/* Campo: Categoría / Tema */}
            <div>
              <label htmlFor="topic" className="block text-sm font-bold text-[#0B1B32] mb-2">
                Tema o Categoría
              </label>
              <input 
                type="text" 
                id="topic"
                name="topic" // Este 'name' es el que lee formData.get("topic") en tu Server Action
                placeholder="Ej. Historia de Roma, Química Orgánica, Arte..."
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#F8FAFB] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B1B32]/20 focus:border-[#0B1B32] transition-all"
              />
            </div>

            {/* Campo: Dificultad */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-bold text-[#0B1B32] mb-2">
                Nivel de Dificultad
              </label>
              <div className="relative">
                <select 
                  id="difficulty"
                  name="difficulty" // formData.get("difficulty")
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#F8FAFB] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B1B32]/20 focus:border-[#0B1B32] transition-all appearance-none cursor-pointer"
                >
                  <option value="Fácil">Fácil</option>
                  <option value="Medio">Medio</option>
                  <option value="Difícil">Difícil</option>
                </select>
                {/* Flechita personalizada para el select */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Renderizamos nuestro botón mágico */}
            <SubmitButton />

          </form>

        </div>
      </div>

    </div>
  );
}