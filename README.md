# Generador_de_examenes

Grupo 602-B
Integrantes del equipo: 
- Leonardo Baurtista Cruz
- Elvia Marlen Hernández García


## ¿De qué trata el proyecto?

Tu aplicación, llamada "The Academic Editorial", es una plataforma educativa y sistema de evaluación interactivo 
(un LMS ligero o plataforma de Quizzes). Está diseñada para que los estudiantes puedan poner a prueba sus conocimientos 
en diferentes categorías, mientras que los administradores o "curadores" pueden gestionar el contenido.

El proyecto se divide en 4 módulos principales:

- Sistema de Autenticación Propio: No usaste librerías pesadas de terceros (como NextAuth/Auth.js), sino que construiste 
un sistema nativo usando Server Actions y Cookies HTTP-only (user_session). Esto maneja el registro, inicio de sesión y 
protección de rutas privadas de forma muy segura y eficiente.

- Motor de Exámenes (Quizzes): Los usuarios navegan por categorías (ej. Matemáticas, Programación). Al entrar a un examen,
 el sistema les presenta preguntas de forma interactiva, controlando la navegación (pregunta anterior/siguiente) y calculando 
 un puntaje al finalizar.

- Panel de Calificaciones (Scores): Un dashboard interactivo (app/scores) donde el estudiante puede ver su progreso histórico 
organizado por categorías, visualizar su puntaje más alto mediante un diseño de "acordeón" y gestionar (eliminar) sus intentos
 pasados.

- Banco de Preguntas (CRUD): Un panel de administración (app/preguntas) que permite crear, listar, editar y actualizar el 
catálogo de preguntas disponibles en el sistema.


¿Qué API se utilizó? (El toque de "Magia")
Aunque el código exacto de tu backend (actions.ts) no está en los fragmentos que me enviaste, los formularios y los tests que armamos nos revelan un detalle increíble: Tu aplicación integra una API de Inteligencia Artificial Generativa.

En el formulario de crear preguntas (/preguntas/new), tienes campos para topic (tema) y difficulty (dificultad), y un botón que cambia su estado a "Generando con IA...".

## ¿Cómo funciona esta integración bajo el capó?

- El Cliente: El usuario (profesor/administrador) escribe "React Hooks" y selecciona dificultad "Difícil".

- El Servidor (Next.js): Tu Server Action recibe estos datos y hace una petición HTTP (fetch) a la API de un modelo de lenguaje (LLM). Por el estándar actual de la industria, es muy probable que estés usando la API de OpenAI (ChatGPT), Anthropic (Claude) o la API de Gemini.

- El Prompt Interno: Tu código le pide a la API algo como: "Genera una pregunta de opción múltiple sobre [Tema] con dificultad [Dificultad]. Devuelve la respuesta en formato JSON con la pregunta, 4 opciones y la respuesta correcta".

- Base de Datos: Recibes ese JSON de la API y lo guardas automáticamente en tu base de datos usando Prisma ORM.