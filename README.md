# Generador_de_examenes

## 1.- Estructura del proyecto

Frontend: React.js con Tailwind CSS (para un diseño rápido y moderno).

Backend: Node.js + Express.

ORM: Prisma (conectado a MongoDB).

IA: Google Gemini API (para la generación automática de preguntas).

Autenticación: JSON Web Tokens (JWT).

## 2.- Modelo de la BD

```bash
// MODELO DE LA BASE DE DTOS
model User {
  id       String   @id @default(auto()) @map("_id") @db.ObjectId
  email    String   @unique
  password String
  name     String
  scores   Score[]
}

model Question {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  category      String
  questionText  String
  correctAnswer String
  options       String[]
  difficulty    String
}

model Score {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  points    Int
  userId    String   @db.ObjectId
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
│   │   └── schema.prisma    # Definición de MongoDB
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
    ├── db_model.png         # Diagrama de Prisma
    └── wireframes.pdf       # Capturas de los diseños
```


## Integración con Google Gemini
1. Para generar las preguntas, usaremos la librería @google/generative-ai. El flujo sería:

2. El usuario envía el tema: "Node.js Event Loop".

3. Enviamos un prompt estructurado a Gemini pidiendo un JSON con: pregunta, opciones y respuesta_correcta.

4. Validamos el JSON y lo guardamos masivamente en MongoDB usando prisma.question.createMany().