// app/examenes/[categoria]/page.tsx
import React from 'react';
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ExamenClientPage from './ExamenClientPage';
import { cookies } from 'next/headers';

const getCurrentUserId = async () => {
  try {
    // 1. Obtenemos las cookies 
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session");

    // 2. Si la cookie existe, extraemos la información
    if (sessionCookie && sessionCookie.value) {
      const userSession = JSON.parse(sessionCookie.value);
      
      // 3. Verificamos que traiga un ID válido
      if (userSession && userSession.id) {
        console.log(`-> Usuario autenticado encontrado: ${userSession.name} (ID: ${userSession.id})`);
        return userSession.id;
      }
    }
  } catch (error) {
    console.error("Error al leer la sesión de las cookies:", error);
  }
  
  // Si no hay sesión o hubo un error, devolvemos null
  console.log("-> No hay un usuario válido en la sesión.");
  return null; 
};
export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  
  // 2. FÍJATE AQUÍ: Usamos await para desenvolver la promesa ANTES de usarla
  const resolvedParams = await params; 
  
  // 3. Ahora sí podemos leer 'category' sin que Next.js lance un error
  const categoriaFormateada = decodeURIComponent(resolvedParams.category).trim();
  // 2. Obtener el ID del usuario autenticado
  const userId = await getCurrentUserId();
  
  if (!userId) {
    redirect("/usuarios"); // Redirigir al login si no hay sesión
  }

  // 3. Consultar la base de datos para traer TODAS las preguntas de esta categoría
  const preguntas = await prisma.question.findMany({
    where: {
      category: categoriaFormateada,
    },
    // No ordenamos aquí, la lógica de mezclar (shuffling) la haremos en el cliente
  });

  // Si no hay preguntas en esta categoría, redirigimos al dashboard
  if (preguntas.length === 0) {
    console.log("No hay preguntas")
    redirect("/");
  }

  // 4. Pasar los datos al Client Component para la interactividad
  return (
    <ExamenClientPage 
      initialQuestions={preguntas} 
      categoria={categoriaFormateada} 
      userId={userId} 
    />
  );
}