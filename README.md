# Generador_de_examenes

Grupo 602-B
Integrantes del equipo: 
- Leonardo Baurtista Cruz
- Elvia Marlen Hernández García

#  "The Academic Editorial"

Una plataforma educativa interactiva diseñada para la gestión de conocimientos y la evaluación de estudiantes a través de exámenes dinámicos por categorías.

##  Tecnologías Principales

* **Framework:** Next.js (App Router)
* **Lenguaje:** TypeScript
* **Base de Datos:** PostgreSQL 
* **Estilos:** Tailwind CSS y Lucide React
* **Seguridad:** Bcrypt (encriptación) y Cookies HTTP-Only

##  Características

* **Sistema de Autenticación Propio:** Registro e inicio de sesión seguro sin dependencias de terceros, protegiendo las sesiones mediante cookies de servidor.
* **Motor de Evaluaciones:** Los usuarios pueden navegar por categorías, responder preguntas de opción múltiple y recibir retroalimentación y puntajes al instante.
* **Panel de Calificaciones (Scores):** Historial detallado donde los estudiantes pueden revisar sus intentos y visualizar su progreso.
* **Banco de Preguntas:** Panel de administración para crear, editar y eliminar preguntas del sistema.

##  Rutas de la API (Endpoints)

El sistema maneja la persistencia y la lógica de negocio a través de las siguientes rutas:


## ⚙️ Lógica de Servidor (Server Actions)

Este proyecto utiliza **Next.js Server Actions** para gestionar la base de datos de forma segura. A diferencia de la propuesta la lógica de backend reside en el archivo `actions.ts`. Ya no tenemos las rutas tradicionales como POST /api/auth/register en cambio se hace ahora como siguen: 

### Funciones de Usuario (Autenticación)
* `registerUser`: Procesa el registro de nuevos usuarios y encripta la contraseña con Bcrypt.
* `loginUser`: Valida las credenciales y genera la cookie de sesión `user_session`.
* `logoutUser`: Elimina la cookie de sesión para cerrar la cuenta.
* `updateUser`: Permite modificar el perfil (nombre y email) de un usuario.
* `deleteUser`: Elimina permanentemente una cuenta de la base de datos.

### Gestión del Banco de Preguntas
* `createGeneratedQuestion`: Crea una nueva pregunta en la base de datos (utiliza integración con el SDK de Google Generative AI).
* `updateQuestion`: Permite editar el texto, categorías y opciones de una pregunta existente.
* `deleteQuestion`: Elimina una pregunta del catálogo.

### Registro de Calificaciones (Scores)
* `saveScore`: Guarda el resultado obtenido por un estudiante al finalizar un examen, vinculándolo a su ID de usuario.
* `deleteScore`: Permite eliminar un registro de puntaje del historial.

  
## Pruebas
El video de las pruebas está en la ruta : img/pruebas_generadorPreguntas.mp4
El video demostracion de uso con demostración de la base de datos: img/demostracionUso_generadorPregutas.mp4
O en el enlace: https://drive.google.com/drive/folders/1W5o26A-elUxttCtYUA5mgw83Pczk3ISJ?usp=sharing
