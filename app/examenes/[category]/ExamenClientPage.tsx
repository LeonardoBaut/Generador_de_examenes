// app/examenes/[categoria]/ExamenClientPage.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, ArrowRight, HelpCircle, FileText, CheckCircle2, 
  XCircle, Clock, BookOpen, AlertTriangle 
} from 'lucide-react';
import { shuffle } from 'lodash'; // Usaremos lodash para una mezcla aleatoria eficiente
import { saveScore } from '@/app/actions'; // Importamos el Server Action
import { redirect } from 'next/navigation';


// Definimos el tipo de una pregunta basada en tu modelo de Prisma
interface Question {
  id: number;
  category: string;
  difficulty: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  
}

// Estructura para rastrear las respuestas del usuario
interface UserAnswer {
  selectedAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
}

export default function ExamenClientPage({ 
  initialQuestions, 
  categoria, 
  userId 
}: { 
  initialQuestions: Question[]; 
  categoria: string; 
  userId: number; 
}) {
  // --- ESTADO ---
  
  // 1. Mezclar preguntas al inicio (una sola vez)
  // useMemo asegura que 'shuffledQuestions' solo cambie si 'initialQuestions' cambia
  const shuffledQuestions = useMemo(() => {
    return shuffle(initialQuestions);
  }, [initialQuestions]);

  // 2. Rastrear el índice de la pregunta actual
  const [currentIndex, setCurrentIndex] = useState(0);

  // 3. Mapa de respuestas del usuario { [questionId: number]: UserAnswer }
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: UserAnswer }>({});

  // 4. Estado de envío (loading)
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 5. Estado de error en el envío
  const [submitError, setSubmitError] = useState<string | null>(null);

  // --- LÓGICA DERIVADA ---
  const currentQuestion = shuffledQuestions[currentIndex];
  const totalQuestions = shuffledQuestions.length;
  const questionsAnswered = Object.keys(userAnswers).length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isFirstQuestion = currentIndex === 0;

  // --- INTERACCIONES ---

  // Función para manejar la selección de una respuesta
  const handleAnswerSelect = (selectedOption: string) => {
    // Si ya contestó esta pregunta, no puede cambiarla
    if (userAnswers[currentQuestion.id]) return;

    // Determinar si es correcta
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    // Actualizar el mapa de respuestas
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        selectedAnswer: selectedOption,
        isCorrect: isCorrect,
        correctAnswer: currentQuestion.correctAnswer,
      }
    }));
  };

  // Navegación entre preguntas
  const goToNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Ir a una pregunta específica desde la barra lateral
  const jumpToQuestion = (index: number) => {
    setCurrentIndex(index);
  };

  // Finalizar el examen
  const handleSubmitExam = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    // Calcular el puntaje final (contar cuántas son correctas en 'userAnswers')
    const finalScoreValue = Object.values(userAnswers).filter(ans => ans.isCorrect).length;

    // Llamar al Server Action para guardar el score
    const result = await saveScore(userId, categoria, finalScoreValue);

    setIsSubmitting(false);

    if (result.success) {
      console.log("¡Examen terminado con éxito!");
      // Opcional: Redirigir a una página de resultados
      // redirect(`/resultados/${result.scoreId}`); 
      alert(`¡Examen terminado! Tu puntaje fue: ${finalScoreValue} / ${totalQuestions}`);
      redirect("/"); // O simplemente al dashboard
      
    } else {
      setSubmitError(result.error || "Ocurrió un error inesperado al guardar tus resultados.");
    }
  };

  // --- RENDERIZADO (UI basada en la imagen `image_1.png`) ---
  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans text-slate-800 py-6 px-4 md:px-12">
      
      {/* CABECERA (Header) */}
      <header className="fixed top-0 left-0 w-full bg-white px-8 py-3 flex items-center justify-between shadow-sm z-50">
        <div className="text-xl font-bold font-serif tracking-tight text-[#0B1B32]">
          {`Examen Final de ${categoria}`}
        </div>
        
        <div className="flex items-center gap-6">
          {/* Temporizador estático como en la imagen */}
          
          <HelpCircle className="w-5 h-5 text-slate-400 cursor-pointer hover:text-[#0B1B32]" />
          
          {/* Botón Terminar Examen */}
          <button 
            onClick={handleSubmitExam}
            disabled={isSubmitting}
            className={`flex items-center gap-2 text-sm font-medium py-2.5 px-6 rounded-lg transition-colors ${
              isSubmitting 
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-[#0B1B32] text-white hover:bg-slate-800'
            }`}
          >
            {isSubmitting ? "Enviando..." : "Terminar Examen"}
          </button>
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL (Con espacio para el header fixed) */}
      <main className="max-w-[1400px] mx-auto w-full flex flex-col md:flex-row gap-10 mt-20 mb-32">
        
        {/* COLUMNA IZQUIERDA: BARRA DE PROGRESO */}
        <aside className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 sticky top-28">
            <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-4">Progreso</h2>
            <p className="text-sm font-medium text-slate-600 mb-6">
              {`${questionsAnswered} de ${totalQuestions} Completadas`}
            </p>
            
            {/* Lista Interactiva de Preguntas */}
            <nav className="flex flex-col gap-2">
              {shuffledQuestions.map((q, index) => {
                const answer = userAnswers[q.id];
                const isCurrent = index === currentIndex;
                const isAnswered = !!answer;
                
                return (
                  <button 
                    key={q.id}
                    onClick={() => jumpToQuestion(index)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
                      isCurrent 
                      ? 'bg-blue-50 text-blue-800 font-semibold border border-blue-200'
                      : isAnswered
                      ? 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                      : 'text-slate-500 hover:bg-slate-100 rounded-lg'
                    }`}
                  >
                    {isAnswered ? (
                       <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                       <FileText className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="text-sm leading-tight">{`Pregunta ${index + 1}`}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* COLUMNA CENTRAL: CONTENIDO DE LA PREGUNTA */}
        <div className="flex-1 flex flex-col gap-8">
          
          {/* Tarjeta de la Pregunta y Respuestas */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-slate-100">
            
            {/* Tag de Categoría y Dificultad */}
            <div className="flex items-center gap-2 mb-6 text-sm">
               <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                 {categoria}
               </span>
               {currentQuestion.difficulty && (
                 <span className="text-slate-500 font-medium">
                    {`Difficulty: ${currentQuestion.difficulty}`}
                 </span>
               )}
            </div>

            {/* Texto de la Pregunta */}
            <h1 className="text-4xl font-serif font-bold text-[#0B1B32] mb-12 leading-tight">
              {currentQuestion.questionText}
            </h1>

            {/* Opciones de Respuesta */}
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => {
                const answerState = userAnswers[currentQuestion.id];
                const isAnswered = !!answerState;
                const isSelected = answerState?.selectedAnswer === option;
                const isCorrectOption = option === currentQuestion.correctAnswer;
                
                // Lógica de colores de retroalimentación
                let optionStyle = "border-slate-200 bg-[#F8FAFB] text-slate-800 hover:border-[#0B1B32] hover:bg-white";
                if (isAnswered) {
                  if (isCorrectOption) {
                    optionStyle = "border-green-300 bg-green-50 text-green-900 font-semibold"; // Verde si es la correcta
                  } else if (isSelected) {
                    optionStyle = "border-red-300 bg-red-50 text-red-900 font-semibold"; // Rojo si es la incorrecta seleccionada
                  } else {
                    optionStyle = "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"; // Deshabilitado para las otras
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={isAnswered}
                    className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all flex items-center justify-between group ${optionStyle} ${
                      isAnswered && 'cursor-not-allowed'
                    }`}
                  >
                    <span className="text-sm font-medium leading-tight">{option}</span>
                    {isAnswered && isCorrectOption && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                    {isAnswered && isSelected && !isCorrectOption && (
                        <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Mensaje de error al enviar */}
            {submitError && (
              <div className="mt-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                {submitError}
              </div>
            )}
          </div>
          
        </div>
      </main>

      {/* BARRA DE NAVEGACIÓN INFERIOR (Fixed) */}
      <footer className="fixed bottom-0 left-0 w-full bg-white px-8 py-4 flex items-center justify-between shadow-lg z-50 border-t border-slate-100">
        
        {/* Botón Anterior */}
        <button 
          onClick={() => setCurrentIndex(prev => prev - 1)}
          disabled={isFirstQuestion}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            isFirstQuestion 
            ? 'text-slate-300 cursor-not-allowed'
            : 'text-slate-600 hover:text-[#0B1B32]'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Anterior
        </button>

        {/* Botón Central: Marcar para Revisión (estático como en la imagen) */}
        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium cursor-pointer hover:text-[#0B1B32]">
           <HelpCircle className="w-4 h-4 text-orange-400" />
           Marcar para revisión
        </div>

        {/* Botón Siguiente Pregunta */}
        <button 
          onClick={goToNextQuestion}
          disabled={isLastQuestion}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            isLastQuestion 
            ? 'text-slate-300 cursor-not-allowed'
            : 'text-blue-600 hover:text-blue-800'
          }`}
        >
          Siguiente Pregunta
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
}