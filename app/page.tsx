import React from 'react';
import prisma from "@/lib/prisma";
import {
  BookOpen, BarChart2, Settings, User, FileQuestion, LogOut, LogIn
} from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { logoutUser } from './actions'; // Asegúrate de que esta función esté en actions.ts

export default async function DashboardPage() {
  // 1. LEER SESIÓN DESDE COOKIES
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user_session");

  let user = null;
  if (sessionCookie) {
    try {
      user = JSON.parse(sessionCookie.value);
    } catch (e) {
      console.error("Error parseando sesión", e);
    }
  }

  // 2. OBTENER CATEGORÍAS DE LA BASE DE DATOS
  const categories = await prisma.question.groupBy({
    by: ['category'],
    _count: { id: true },
  });

  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans text-slate-800">

      {/* NAVEGACIÓN SUPERIOR */}
      <header className="bg-white px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="text-xl font-bold font-serif tracking-tight text-[#0B1B32]">
          The Academic Editorial
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            // Si hay usuario, mostramos botón de cerrar sesión
            <form action={logoutUser}>
              <button
                type="submit"
                className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition-colors border border-red-100"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </form>
          ) : (
            // Si no hay usuario, mostramos el botón de acceso
            <Link
              href="/usuarios"
              className="flex items-center gap-2 bg-[#0B1B32] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Iniciar Sesión / Registro
            </Link>
          )}
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="max-w-[1400px] mx-auto w-full p-6 flex flex-col md:flex-row gap-8 mt-4">

        {/* COLUMNA IZQUIERDA: BARRA LATERAL */}
        <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-6">

          {/* Perfil del Usuario (Dinámico) */}
          <div className="flex items-center gap-4 p-2 bg-white md:bg-transparent rounded-xl shadow-sm md:shadow-none">
            <div className="w-12 h-12 bg-[#F3A88C] rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
              <User className="text-white w-8 h-8 mt-2" />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-sm leading-tight truncate text-[#0B1B32]">
                {user ? user.name : "Invitado"}
              </h3>
              <p className="text-xs text-slate-500 mt-1 truncate">
                {user ? user.email : "Inicia sesión para guardar progreso"}
              </p>
            </div>
          </div>

          {/* Menú de Navegación */}
          <nav className="flex flex-col gap-2 mt-2">
            <Link href="/" className="flex items-center gap-3 bg-[#0B1B32] text-white px-4 py-3 rounded-lg font-semibold shadow-md">
              <BookOpen className="w-5 h-5" />
              Exámenes
            </Link>
            <Link href="/preguntas" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-[#0B1B32] hover:bg-white rounded-lg font-medium transition-all">
              <FileQuestion className="w-5 h-5" />
              Preguntas
            </Link>
            <Link href="/scores" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-[#0B1B32] hover:bg-white rounded-lg font-medium transition-all">
              <BarChart2 className="w-5 h-5" />
              Scores
            </Link>
          </nav>

          <div className="flex flex-col gap-2 border-t border-slate-200 pt-4">
            <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-[#0B1B32] font-medium transition-colors">
              <Settings className="w-5 h-5" />
              Configuración
            </Link>
          </div>
        </aside>

        {/* COLUMNA CENTRAL: CONTENIDO DINÁMICO */}
        <div className="flex-1 flex flex-col gap-8">
          <div>
            <p className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-2">Panel de Control</p>
            <h1 className="text-4xl font-serif font-bold text-[#0B1B32] mb-4">
              {user ? `¡Hola de nuevo, ${user.name.split(' ')[0]}!` : "Tus Exámenes Disponibles"}
            </h1>
            <p className="text-slate-600 max-w-lg">
              {categories.length > 0
                ? `Tienes ${categories.length} categorías listas para practicar hoy.`
                : "Aún no hay categorías disponibles. Comienza agregando preguntas."}
            </p>
          </div>

          {/* Lista de Exámenes */}
          <div className="grid gap-4">
            {categories.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-sm text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">No hay preguntas registradas en la base de datos.</p>
                <Link href="/preguntas" className="text-blue-600 text-sm font-bold mt-2 inline-block hover:underline">Ir a crear preguntas →</Link>
              </div>
            ) : (
              categories.map((cat, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between hover:shadow-md transition-all border border-transparent hover:border-slate-200 group">
                  <div className="flex items-center gap-6">
                    <div className="text-center border-r-2 border-slate-100 pr-6 min-w-[100px]">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Preguntas</p>
                      <p className="text-3xl font-black text-[#0B1B32] group-hover:text-blue-600 transition-colors">{cat._count.id}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#0B1B32]">Test de {cat.category}</h3>
                      <p className="text-sm text-slate-500">Evaluación académica de nivel profesional</p>
                      <div className="mt-2 flex gap-2">
                        <span className="inline-block bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Activo</span>
                        <span className="inline-block bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Práctica</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/examenes/${encodeURIComponent(cat.category)}`}
                    className="mt-4 sm:mt-0 bg-[#0B1B32] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-sm hover:shadow-lg active:scale-95"
                  >
                    Comenzar Test
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: RENDIMIENTO */}
        <aside className="w-full lg:w-[320px] flex-shrink-0">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 sticky top-24">
            <h2 className="text-xl font-bold font-serif text-[#0B1B32] mb-6">Tu Progreso</h2>

            {!user ? (
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
                <p className="text-blue-800 text-sm font-medium mb-4">Inicia sesión para guardar tus puntajes y ver estadísticas.</p>
                <Link href="/usuarios" className="text-xs font-bold text-blue-700 uppercase hover:underline">Identificarse ahora</Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#F8FAFB] p-6 rounded-2xl text-center border border-dashed border-slate-300">
                  <p className="text-slate-500 text-sm">Aún no has completado exámenes recientemente.</p>
                </div>
                <Link href="/scores" className="block w-full text-center bg-[#0B1B32] text-white py-3.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-sm">
                  Ver Historial Completo
                </Link>
              </div>
            )}
          </div>
        </aside>

      </main>
    </div>
  );
}