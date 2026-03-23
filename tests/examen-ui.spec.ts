import { test, expect } from '@playwright/test';

test.describe('Examen - Lógica de Interfaz', () => {

  test('Los botones de navegación se deshabilitan correctamente', async ({ page }) => {
    // 1. Login rápido
    await page.goto('/usuarios');
    await page.fill('input[name="email"]', '15ghrosita@gmail.com'); // PON TU CORREO
    await page.fill('input[name="password"]', '1q2w3e');       // PON TU PASSWORD
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL('http://localhost:3000/');

    // 2. Navegamos a una categoría con AL MENOS 2 preguntas (ej. Historia)
    await page.goto('/examenes/Tecnología'); 

    // 3. Al iniciar, el botón "Anterior" DEBE estar deshabilitado (isFirstQuestion = true)
    const btnAnterior = page.locator('button:has-text("Anterior")');
    await expect(btnAnterior).toBeDisabled();

    // 4. Hacemos clic en "Siguiente Pregunta"
    const btnSiguiente = page.locator('button:has-text("Siguiente Pregunta")');
    await btnSiguiente.click();

    // 5. Ahora el botón "Anterior" DEBE estar habilitado
    await expect(btnAnterior).toBeEnabled();

    // 6. Probamos la barra lateral (Sidebar) haciendo clic en la "Pregunta 1"
    const sidebarPregunta1 = page.locator('nav button', { hasText: 'Pregunta 1' });
    await sidebarPregunta1.click();

    // Verificamos que al volver a la 1, "Anterior" se vuelve a deshabilitar
    await expect(btnAnterior).toBeDisabled();
  });

});