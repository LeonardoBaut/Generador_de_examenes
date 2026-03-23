import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('Iniciando el seeding...');

  // 2. Crear las Preguntas (usando createMany ya que no tienen relaciones anidadas)
  const questions = await prisma.question.createMany({
    data: [
      {
        category: "Historia",
        questionText: "¿En qué año llegó Cristóbal Colón a América?",
        correctAnswer: "1492",
        options: ["1490", "1492", "1501", "1512"],
        difficulty: "Fácil"
      },
      {
        category: "Ciencia",
        questionText: "¿Cuál es el símbolo químico del oro?",
        correctAnswer: "Au",
        options: ["Ag", "Au", "Fe", "Pb"],
        difficulty: "Medio"
      },
      {
        category: "Geografía",
        questionText: "¿Cuál es la capital de Japón?",
        correctAnswer: "Tokio",
        options: ["Kioto", "Osaka", "Tokio", "Seúl"],
        difficulty: "Fácil"
      },
      {
        category: "Deportes",
        questionText: "¿Cuántos jugadores tiene un equipo de fútbol en la cancha?",
        correctAnswer: "11",
        options: ["9", "10", "11", "12"],
        difficulty: "Fácil"
      },
      {
        category: "Entretenimiento",
        questionText: "¿Quién dirigió la película 'El Origen' (Inception)?",
        correctAnswer: "Christopher Nolan",
        options: ["Steven Spielberg", "Christopher Nolan", "Quentin Tarantino", "Martin Scorsese"],
        difficulty: "Medio"
      },
      {
        category: "Matemáticas",
        questionText: "¿Cuál es la raíz cuadrada de 144?",
        correctAnswer: "12",
        options: ["10", "11", "12", "14"],
        difficulty: "Fácil"
      },
      {
        category: "Literatura",
        questionText: "¿Quién escribió 'Cien años de soledad'?",
        correctAnswer: "Gabriel García Márquez",
        options: ["Gabriel García Márquez", "Miguel de Cervantes", "Jorge Luis Borges", "Julio Cortázar"],
        difficulty: "Medio"
      },
      {
        category: "Arte",
        questionText: "¿Quién pintó la Mona Lisa?",
        correctAnswer: "Leonardo da Vinci",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
        difficulty: "Fácil"
      },
      {
        category: "Tecnología",
        questionText: "¿Qué significan las siglas HTML?",
        correctAnswer: "HyperText Markup Language",
        options: ["HyperText Markup Language", "HyperText Machine Language", "HyperTool Markup Language", "HighText Markup Language"],
        difficulty: "Difícil"
      },
      {
        category: "Biología",
        questionText: "¿Cuál es el órgano más grande del cuerpo humano?",
        correctAnswer: "La piel",
        options: ["El hígado", "El corazón", "El cerebro", "La piel"],
        difficulty: "Medio"
      }
    ]
  });

  console.log(`Se crearon ${questions.count} preguntas.`);
  console.log('Seeding terminado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });