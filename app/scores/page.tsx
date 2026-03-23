// app/score/page.tsx
import React from 'react';
import { cookies } from 'next/headers';
import Link from 'next/link';

import prisma from "@/lib/prisma";
import ScoreClient from './ScoreClient';

const getCurrentUser = async () => {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("user_session");
        if (sessionCookie && sessionCookie.value) {
            const userSession = JSON.parse(sessionCookie.value);
            if (userSession && userSession.id) return userSession;
        }
    } catch (error) {
        console.error("Error leyendo sesión:", error);
    }
    return null;
};

export default async function ScorePage() {
    const user = await getCurrentUser();

    // Si no hay usuario, mostramos el mensaje con el link a /usuarios
    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Acceso Denegado</h2>
                    <p className="text-slate-600 mb-6">Debes iniciar sesión para ver tus calificaciones.</p>
                    <Link
                        href="/usuarios"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors block w-full"
                    >
                        Ir a Iniciar Sesión
                    </Link>
                </div>
            </div>
        );
    }

    // 1. Obtenemos todas las categorías disponibles de los exámenes
    const questions = await prisma.question.findMany({ select: { category: true } });
    // Le decimos explícitamente que 'q' es un objeto con 'category: string'
    const allCategories = Array.from(
        new Set<string>(questions.map((q: { category: string }) => q.category))
    );
    // 2. Obtenemos TODOS los scores del usuario logueado
    const userScores = await prisma.score.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' } // Los más recientes primero
    });

    return (
        <div className="min-h-screen bg-slate-50 p-6 sm:p-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Mis Calificaciones</h1>
                <p className="text-slate-600 mb-8">Estudiante: {user.name}</p>

                {/* Pasamos los datos al componente cliente para la interactividad */}
                <ScoreClient categories={allCategories} scores={userScores} />
            </div>
        </div>
    );
}