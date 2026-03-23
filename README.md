# Generador_de_examenes

## 1.- Estructura del proyecto

Frontend: React.js con Tailwind CSS (para un diseño rápido y moderno).

Backend: Node.js + Express.

ORM: Prisma (conectado a Prostgress).

IA: Google Gemini API (para la generación automática de preguntas).

Autenticación: JSON Web Tokens (JWT).

## 2.- Modelo de la BD

```bash
// MODELO DE LA BASE DE DTOS
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  scores    Score[]  // Relación 1:N
}

model Question {
  id            Int      @id @default(autoincrement())
  category      String
  questionText  String
  correctAnswer String
  options       String[] // PostgreSQL soporta arrays nativamente
  difficulty    String
}

model Score {
  id        Int      @id @default(autoincrement())
  points    Int
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}

```

## 3.- Diseño de la API

### Usuarios y Auth
POST /api/auth/register: Registro de nuevos usuarios.

POST /api/auth/login: Login y entrega de Token.

### Preguntas (CRUD + IA)
- GET /api/questions: Listar todas las preguntas.

- POST /api/questions/generate: Endpoint clave que conecta con la API de Google Gemini para recibir un tema (ej: "React Hooks") y poblar la DB.

- PUT /api/questions/:id: Editar pregunta.

- DELETE /api/questions/:id: Eliminar pregunta.

### Puntajes
GET /api/scores/leaderboard: Ranking de usuarios.

POST /api/scores: Registrar un nuevo resultado al terminar un test.

## 4.- Pantallas (Wireframes)

- Login: Formulario limpio con validaciones en tiempo real.

- Dashboard (Admin): Panel para gestionar el CRUD y un botón destacado: "Generar Preguntas con IA".

- Quiz View: Interfaz de usuario para responder las preguntas con barra de progreso.

- Resultados: Resumen de aciertos y actualización del perfil del usuario.

## 5.- Estructura del Proyecto 
```bash
/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma    # Definición de PostgreSQL (Tablas y Relaciones)
│   ├── src/
│   │   ├── controllers/     # Lógica de Gemini y CRUD
│   │   ├── routes/
│   │   └── index.ts
│   └── .env                 # API_KEY de Google Gemini
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/           # Login, Dashboard, Quiz
│   │   └── api/             # Axios/Fetch a nuestra API
└── propuesta/
    ├── README.md            # Explicación detallada

```


##5.- Integración con Google Gemini
1. Para generar las preguntas, usaremos la librería @google/generative-ai. El flujo sería:

2. El usuario envía el tema: "Node.js Event Loop".

3. Enviamos un prompt estructurado a Gemini pidiendo un JSON con: pregunta, opciones y respuesta_correcta.

4. Validamos el JSON y lo guardamos masivamente en MongoDB usando prisma.  prisma.question.createMany()


## 6.- Interfaz


### Inicio de sesión del usuario
![interfaz del inicio de sesión del usuario](/img/login.png)

Punto de entrada seguro a la plataforma. Esta interfaz permite a los usuarios autenticarse para acceder a sus estadísticas personalizadas y al generador de exámenes.

- Autenticación Robusta: Implementación para el manejo de sesiones seguras.

- Validación en Tiempo Real: Formulario desarrollado con React que valida el formato del correo y la fortaleza de la contraseña antes de enviar la petición al backend.

- Seguridad: Las contraseñas se procesan en el backend de Node.js utilizando encriptación unidireccional (hashing) antes de interactuar con la base de datos PostgreSQL.

### Questionarios
![pantalla general](/img/interfaz1.png)

Panel principal o Dashboard donde el usuario gestiona su experiencia de aprendizaje. Es el centro de control que conecta la base de datos con la interfaz de usuario.

- Exploración por Categorías: Visualización dinámica de los cuestionarios disponibles almacenados en PostgreSQL, filtrados por tema (ej. React, Node.js, Bases de Datos).

- Generación con IA: Acceso directo al módulo de Google Gemini API, donde el usuario puede solicitar la creación de un nuevo banco de preguntas simplemente ingresando un tema de interés.

- Historial de Progreso: Resumen rápido de los últimos puntajes obtenidos, recuperados eficientemente mediante las relaciones de Prisma entre las tablas User y Score.

### Preguntas
![pantalla general](/img/preguntas.png)

Entorno de evaluación interactivo diseñado para una experiencia de usuario fluida y sin distracciones.

- Carga Dinámica: Las preguntas se consumen desde nuestra API REST, seleccionando aleatoriamente opciones del banco de datos generado por la IA.

- Componentes Reactivos: Uso de estados de React para manejar la selección de respuestas, el temporizador y la barra de progreso en tiempo real.

- Persistencia de Resultados: Al finalizar, el sistema calcula automáticamente el puntaje y utiliza Prisma ORM para registrar el resultado de forma atómica en la base de datos, vinculándolo instantáneamente al perfil del usuario.