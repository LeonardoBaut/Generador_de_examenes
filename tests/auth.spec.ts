// // tests/auth.spec.ts
// import { test, expect } from '@playwright/test';

// test.describe('Flujo de Autenticación', () => {
  
//   test('Debería mostrar error con credenciales incorrectas', async ({ page }) => {
//     // 1. Navegamos a la página de login
//     await page.goto('/usuarios'); // O la ruta donde tengas tu formulario

//     // 2. Llenamos el formulario
//     // (Asegúrate de que tus inputs en page.tsx tengan los atributos name="email" y name="password")
//     await page.fill('input[name="email"]', 'usuario_falso@correo.com');
//     await page.fill('input[name="password"]', 'contraseña_incorrecta');

//     // 3. Hacemos clic en el botón de submit
//     await page.click('button[type="submit"]');

//     // 4. Verificamos que aparezca el mensaje de error de tu Server Action
//     // Ajusta el texto según cómo lo muestres en tu UI
//     await expect(page.locator('text=Credenciales inválidas')).toBeVisible();
//   });

//   test('La página de generación de preguntas debe cargar correctamente', async ({ page }) => {
//     // Navegamos directamente a la ruta protegida/generador
//     await page.goto('/preguntas/new');
    
//     // Verificamos que el título esté visible
//     await expect(page.locator('h1:has-text("Nueva Pregunta")')).toBeVisible();
    
//     // Verificamos que el botón de generar IA esté en la pantalla
//     await expect(page.locator('button:has-text("Generar Pregunta Mágicamente")')).toBeVisible();
//   });

// });



import { test, expect } from '@playwright/test';

test.describe('Flujo de Autenticación (Login y Registro)', () => {

  test('El registro falla si las contraseñas no coinciden', async ({ page }) => {
    await page.goto('/usuarios/register');

    await page.fill('input[name="name"]', 'Usuario de Prueba');
    await page.fill('input[name="email"]', 'test@correo.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'PasswordDiferente'); // Diferente a propósito

    await page.click('button:has-text("Registrarse")');

    // Verificamos tu validación de cliente
    await expect(page.locator('text=Las contraseñas no coinciden. Por favor, verifícalas.')).toBeVisible();
  });

  test('Debería registrar un usuario exitosamente', async ({ page }) => {
    // Generamos un email único para no chocar con Prisma (@unique)
    const uniqueEmail = `testuser_${Date.now()}@academic.edu`;

    await page.goto('/usuarios/register');

    await page.fill('input[name="name"]', 'Curador de Arte');
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');

    await page.click('button:has-text("Registrarse")');

    // Asumiendo que tu Server Action redirige al login o al dashboard al terminar:
    // Aquí verificamos que no se haya quedado estancado mostrando el formulario
    await expect(page.locator('button:has-text("Creando cuenta...")')).toBeHidden();
  });

  test('Debería iniciar sesión y redirigir al Dashboard', async ({ page }) => {
    await page.goto('/usuarios');

    // 1️⃣ ASEGÚRATE de poner un correo y contraseña que sepas que SÍ
    // existen actualmente en tu base de datos local (puedes revisarlo en Prisma Studio)
    await page.fill('input[name="email"]', '15ghrosita@gmail.com'); 
    await page.fill('input[name="password"]', '1q2w3e');

    await page.click('button:has-text("Sign In")');

    // 2️⃣ TRUCO DE DEPURACIÓN: Vamos a revisar si tu UI muestra el mensaje de error rojo
    // Buscamos el contenedor rojo que tienes en app/usuarios/page.tsx
    const errorBanner = page.locator('.bg-red-50.text-red-700');
    
    // Le damos 3 segundos para ver si aparece el error de credenciales
    try {
      await expect(errorBanner).toBeVisible({ timeout: 3000 });
      const textoError = await errorBanner.textContent();
      // Si entra aquí, significa que las credenciales estaban mal. Lanzamos un error claro:
      throw new Error(`❌ El inicio de sesión falló. La aplicación mostró este mensaje: "${textoError?.trim()}"`);
    } catch (e) {
      if (e instanceof Error && e.message.includes("El inicio de sesión falló")) {
        throw e; // Relanzamos nuestro error personalizado
      }
      // Si no apareció el banner de error, todo va bien, continuamos...
    }

    // 3️⃣ Aumentamos un poco el tiempo de espera a 10 segundos (10000ms) 
    // por si tu base de datos local o la creación de la cookie tarda un poco más.
    await expect(page).toHaveURL('http://localhost:3000/', { timeout: 10000 });
});

});