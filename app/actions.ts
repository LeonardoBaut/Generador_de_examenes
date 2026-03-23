"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// ==========================================
//           ACCIONES PARA USUARIOS
// ==========================================

// --- CREAR USUARIO ---
export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const contra = formData.get("password") as string; 
    
    // 1. Validar que vengan todos los campos
    if (!name || !email || !contra) {
        return { success: false, error: "Todos los campos son obligatorios." };
    }

    try {
        // 2. Comprobar si el correo ya está registrado
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { success: false, error: "Este correo electrónico ya está registrado." };
        }

        // 3. Encriptar la contraseña de forma segura
        const password = await bcrypt.hash(contra, 10);
        
        // 4. Crear el usuario en la base de datos
        await prisma.user.create({
            data: { name, email, password },
        });

    } catch (error) {
        // Si la base de datos se cae o hay un error inesperado
        console.error("Error al registrar:", error);
        return { success: false, error: "Ocurrió un error inesperado al crear tu cuenta." };
    }

    redirect("/usuarios");
}
export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const contra = formData.get("password") as string;

  if (!email || !contra) {
    return { success: false, error: "El correo y la contraseña son obligatorios." };
  }

  try {
    // 1. Buscamos al usuario en PostgreSQL
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "Credenciales inválidas." };
    }

    // 2. Comparamos la contraseña escrita con la encriptada en la base de datos
    const passwordMatch = await bcrypt.compare(contra, user.password);

    if (!passwordMatch) {
      return { success: false, error: "Credenciales inválidas." };
    }

    // 3. ¡LOGIN EXITOSO! Guardamos los datos del usuario en una Cookie
    // Como estás en Next.js 15, usamos 'await cookies()'
    const cookieStore = await cookies();
    
    // Creamos un objeto solo con lo que queremos mostrar (¡NUNCA guardes la contraseña aquí!)
    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    cookieStore.set("user_session", JSON.stringify(sessionData), {
      httpOnly: true, // Por seguridad, para que no la roben con JavaScript
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // La sesión durará 1 semana
      path: "/",
    });

  } catch (error) {
    console.error("Error en login:", error);
    return { success: false, error: "Ocurrió un error inesperado al iniciar sesión." };
  }

  // Redirigimos al dashboard
  redirect("/");
}

// ----------------------------------------
// 2. FUNCIÓN PARA CERRAR SESIÓN
// ----------------------------------------
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("user_session"); // Borramos la cookie mágica
  redirect("/usuarios");
}
// --- ACTUALIZAR USUARIO ---
export async function updateUser(id: number, formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    await prisma.user.update({
        where: { id },
        data: { name, email },
    });

    revalidatePath("/usuarios");
    redirect("/usuarios");
}

// --- BORRAR USUARIO ---
export async function deleteUser(id: number) {
    // Si el usuario tiene scores asociados, Prisma arrojará un error de llave foránea
    // a menos que configures onDelete: Cascade en tu esquema.
    await prisma.user.delete({
        where: { id },
    });

    revalidatePath("/usuarios");
}


// ==========================================
//           ACCIONES PARA PREGUNTAS
// ==========================================

// --- CREAR PREGUNTA ---
export async function createGeneratedQuestion(formData: FormData) {
    // Ahora el formulario solo nos enviará el tema y la dificultad deseada
    const topic = formData.get("topic") as string || "Cultura General";
    const difficulty = formData.get("difficulty") as string || "Medio";

    // 1. Configuramos el modelo de Gemini (usamos flash porque es rápido y excelente para texto)
    // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
            responseMimeType: "application/json", // ¡ESTA ES LA MAGIA!
        }
    });

    // 2. Creamos un "prompt" muy estricto para que Gemini nos devuelva exactamente lo que Prisma necesita
    const prompt = `
    Genera una pregunta de opción múltiple sobre el tema: "${topic}" con una dificultad: "${difficulty}".
    Debes devolver ÚNICAMENTE un objeto JSON válido. No uses formato markdown, no incluyas texto extra, solo el JSON puro con esta estructura exacta:
    {
      "category": "Nombre de la categoría generada",
      "questionText": "El texto de la pregunta",
      "correctAnswer": "La respuesta correcta",
      "options": ["opcion 1", "opcion 2", "opcion 3", "opcion 4"],
      "difficulty": "${difficulty}"
    }
    Importante: 'correctAnswer' debe ser exactamente igual a una de las cadenas dentro del arreglo 'options'.
    `;

    try {
        // 3. Llamamos a la API de Google
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // 4. Limpiamos el texto por si el modelo incluyó las etiquetas de markdown (```json ... ```)
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        // 5. Convertimos el texto JSON a un objeto de JavaScript
        const questionData = JSON.parse(cleanJson);

        // 6. Guardamos en la base de datos con Prisma
        await prisma.question.create({
            data: { 
                category: questionData.category, 
                questionText: questionData.questionText, 
                correctAnswer: questionData.correctAnswer, 
                options: questionData.options, 
                difficulty: questionData.difficulty 
            },
        });

    } catch (error) {
        console.error("Error al generar o guardar la pregunta:", error);
        throw new Error("Fallo al generar la pregunta con IA.");
    }

    revalidatePath("/preguntas");
    redirect("/preguntas");
}

// --- ACTUALIZAR PREGUNTA ---
export async function updateQuestion(id: number, formData: FormData) {
    const category = formData.get("category") as string;
    const questionText = formData.get("questionText") as string;
    const correctAnswer = formData.get("correctAnswer") as string;
    const difficulty = formData.get("difficulty") as string;
    
    const optionsString = formData.get("options") as string;
    const options = optionsString.split(",").map((o) => o.trim());

    await prisma.question.update({
        where: { id },
        data: { category, questionText, correctAnswer, options, difficulty },
    });

    revalidatePath("/preguntas");
    redirect("/preguntas");
}

// --- BORRAR PREGUNTA ---
export async function deleteQuestion(id: number) {
    await prisma.question.delete({
        where: { id },
    });

    revalidatePath("/preguntas");
}


// ==========================================
//             ACCIONES PARA SCORES
// ==========================================

// --- CREAR PUNTAJE (SCORE) ---
// Reemplaza tu antigua función de crear categorías
// export async function createScore(formData: FormData) {
//     const points = parseInt(formData.get("points") as string);
//     const userId = parseInt(formData.get("userId") as string);

//     await prisma.score.create({
//         data: {
//             points: points,
//             userId: userId,
//         },
//     });

//     // Actualizamos la vista del perfil del usuario para que refleje su nuevo puntaje
//     revalidatePath(`/usuarios/${userId}`);
//     redirect(`/usuarios/${userId}`);
// }
export async function saveScore(userId: number, category: string, scoreValue: number) {
  if (!userId || !category) {
    return { success: false, error: "Datos de sesión inválidos." };
  }

  try {
    // Creamos la entrada en la tabla Score
    const score = await prisma.score.create({
      data: {
        userId: userId,
        category: category,
        points: scoreValue, // Número de respuestas correctas
      },
    });

    console.log(`Score guardado para usuario ${userId}: ${scoreValue} en ${category}`);
    
    // Opcional: Revalidar alguna ruta si es necesario
    revalidatePath("/"); 
    
    // Redirigimos a una página de resultados (puedes crearla después)
    // redirect(`/resultados/${score.id}`);

    // Por ahora, simplemente devolvemos éxito y el ID del score
    return { success: true, scoreId: score.id };

  } catch (error) {
    console.error("Error al guardar el score:", error);
    return { success: false, error: "Ocurrió un error inesperado al guardar tus resultados." };
  }
}

export async function deleteScore(scoreId: number) {
  try {
    await prisma.score.delete({
      where: { id: scoreId },
    });
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar el score:", error);
    return { success: false, error: "No se pudo eliminar el puntaje." };
  }
}