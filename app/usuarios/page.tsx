"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { ArrowLeft, BrainCircuit } from 'lucide-react';
// Asegúrate de que esta ruta apunte correctamente a tu archivo actions.ts
import { loginUser } from '@/app/actions'; 
import { redirect } from 'next/navigation';

// 1. Creamos un subcomponente para el botón de inicio de sesión. 
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
          Iniciando sesión...
        </>
      ) : (
        "Sign In"
      )}
    </button>
  );
}

// 2. La página de Login principal
export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function loginAction(formData: FormData) {
    const result = await loginUser(formData);
    if (result && !result.success) {
      setError(result.error || "Ocurrió un error inesperado");
    } else {
      // Si el login tiene éxito, la función loginUser en actions.ts redirigirá al dashboard
      setError(null);
      redirect("/");
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans text-slate-800 flex flex-col items-center justify-center">
      
      {/* NAVEGACIÓN SUPERIOR SIMULADA */}
      <header className="fixed top-0 left-0 w-full bg-white px-8 py-4 flex items-center justify-between shadow-sm z-50">
        <div className="text-xl font-bold font-serif tracking-tight text-[#0B1B32]">
          The Academic Editorial
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL DEL FORMULARIO */}
      <div className="w-full max-w-lg mt-24">
        {/* Botón de regreso (opcional, pero buena práctica) */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0B1B32] font-medium transition-colors mb-6 ml-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al Dashboard
        </Link>

        {/* Tarjeta del Formulario de Login */}
        <div className="bg-white p-10 md:p-12 rounded-3xl shadow-lg border border-slate-100 mx-4">
          
          <div className="flex flex-col items-center text-center mb-10 border-b border-slate-100 pb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
              <BrainCircuit className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-[#0B1B32]">Welcome Back</h1>
            <p className="text-slate-500 mt-3 text-sm max-w-sm">
              Continue your intellectual journey. Please enter your email and password to sign in.
            </p>
          </div>

          {/* MENSAJE DE ERROR SI EL LOGIN FALLA */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {/* FORMULARIO DE LOGIN */}
          <form action={loginAction} className="space-y-6">
            
            {/* Campo: Dirección de Correo Electrónico */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#0B1B32] mb-2 uppercase tracking-wider">
                Correo electronico
              </label>
              <input 
                type="email" 
                id="email"
                name="email" // Este 'name' es el que lee formData.get("email") en tu Server Action
                placeholder="curator@academic.edu"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-[#F8FAFB] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B1B32]/10 focus:border-[#0B1B32] transition-all"
              />
            </div>

            {/* Campo: Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-bold text-[#0B1B32] uppercase tracking-wider">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-medium text-slate-500 hover:text-[#0B1B32]">
                  Olvidaste tu contraseña?
                </Link>
              </div>
              <input 
                type="password" 
                id="password"
                name="password" // formData.get("password")
                placeholder="••••••••"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-[#F8FAFB] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B1B32]/10 focus:border-[#0B1B32] transition-all"
              />
            </div>

            {/* Renderizamos nuestro botón mágico de inicio de sesión */}
            <SubmitButton />

          </form>

          {/* PIE DE PÁGINA DEL FORMULARIO */}
          <div className="mt-10 border-t border-slate-100 pt-8 text-center">
            <p className="text-sm text-slate-500">
              No tienes cuenta? <Link href="/usuarios/register" className="font-semibold text-[#0B1B32] hover:text-slate-800">Registrarse</Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}