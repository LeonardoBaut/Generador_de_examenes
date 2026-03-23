"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { ArrowLeft, UserPlus } from 'lucide-react'; // Cambié el ícono para que tenga más sentido con "registro"
// Asegúrate de crear esta función en tu archivo actions.ts
import { registerUser } from '@/app/actions'; 

// 1. Subcomponente para el botón de registro
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
          <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          Creando cuenta...
        </>
      ) : (
        "Registrarse"
      )}
    </button>
  );
}

// 2. La página de Registro principal
export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);

  async function registerAction(formData: FormData) {
    // Validación rápida en el cliente: Verificamos que las contraseñas coincidan
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden. Por favor, verifícalas.");
      return;
    }

    // Si coinciden, enviamos los datos al Server Action
    const result = await registerUser(formData);
    
    if (result && !result.success) {
      setError(result.error || "Ocurrió un error inesperado al crear la cuenta");
    } else {
      setError(null);
      // El Server Action se encargará de redirigir al login o al dashboard al terminar
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans text-slate-800 flex flex-col items-center justify-center py-12">
      
      {/* NAVEGACIÓN SUPERIOR */}
      <header className="fixed top-0 left-0 w-full bg-white px-8 py-4 flex items-center justify-between shadow-sm z-50">
        <div className="text-xl font-bold font-serif tracking-tight text-[#0B1B32]">
          The Academic Editorial
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="w-full max-w-lg mt-16">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0B1B32] font-medium transition-colors mb-6 ml-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al Inicio de Sesión
        </Link>

        {/* Tarjeta del Formulario */}
        <div className="bg-white p-10 md:p-12 rounded-3xl shadow-lg border border-slate-100 mx-4">
          
          <div className="flex flex-col items-center text-center mb-10 border-b border-slate-100 pb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
              <UserPlus className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-[#0B1B32]">Crear Cuenta</h1>
            <p className="text-slate-500 mt-3 text-sm max-w-sm">
              Únete a nosotros. Por favor completa los siguientes datos para registrarte en la plataforma.
            </p>
          </div>

          {/* MENSAJE DE ERROR */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {/* FORMULARIO */}
          <form action={registerAction} className="space-y-5">
            
            {/* Campo: Nombre Completo */}
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-[#0B1B32] mb-2 uppercase tracking-wider">
                Nombre Completo
              </label>
              <input 
                type="text" 
                id="name"
                name="name" 
                placeholder="Ej. Juan Pérez"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-[#F8FAFB] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B1B32]/10 focus:border-[#0B1B32] transition-all"
              />
            </div>

            {/* Campo: Correo Electrónico */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#0B1B32] mb-2 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <input 
                type="email" 
                id="email"
                name="email" 
                placeholder="correo@ejemplo.com"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-[#F8FAFB] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B1B32]/10 focus:border-[#0B1B32] transition-all"
              />
            </div>

            {/* Campo: Contraseña */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-[#0B1B32] mb-2 uppercase tracking-wider">
                Contraseña
              </label>
              <input 
                type="password" 
                id="password"
                name="password" 
                placeholder="••••••••"
                required
                minLength={6} // Agregamos validación nativa de HTML para longitud mínima
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-[#F8FAFB] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B1B32]/10 focus:border-[#0B1B32] transition-all"
              />
            </div>

            {/* Campo: Confirmar Contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-bold text-[#0B1B32] mb-2 uppercase tracking-wider">
                Confirmar Contraseña
              </label>
              <input 
                type="password" 
                id="confirmPassword"
                name="confirmPassword" 
                placeholder="••••••••"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-[#F8FAFB] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B1B32]/10 focus:border-[#0B1B32] transition-all"
              />
            </div>

            {/* Botón de envío */}
            <div className="pt-2">
              <SubmitButton />
            </div>

          </form>

          {/* PIE DE PÁGINA */}
          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              ¿Ya tienes una cuenta? <Link href="/usuarios" className="font-semibold text-[#0B1B32] hover:text-slate-800">Inicia sesión aquí</Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}