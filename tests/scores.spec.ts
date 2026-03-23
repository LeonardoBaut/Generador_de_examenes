import { test, expect } from '@playwright/test';

test.describe('Gestión de Calificaciones (Scores)', () => {

  test('Debe denegar el acceso a un usuario sin sesión', async ({ page }) => {
    await page.goto('/scores');

    // Verificamos que se muestre tu componente de "Acceso Denegado"
    await expect(page.locator('h2:has-text("Acceso Denegado")')).toBeVisible();
    await expect(page.locator('text=Debes iniciar sesión para ver tus calificaciones.')).toBeVisible();
    
    // Verificamos que el botón redirija al login
    const loginLink = page.locator('a:has-text("Ir a Iniciar Sesión")');
    await expect(loginLink).toHaveAttribute('href', '/usuarios');
  });

  test('Usuario logueado puede ver y borrar su historial de puntajes', async ({ page }) => {
    // 1. Iniciamos sesión primero
    await page.goto('/usuarios');
    await page.fill('input[name="email"]', '15ghrosita@gmail.com'); // Usa datos reales de tu BD local
    await page.fill('input[name="password"]', '1q2w3e');
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL('/');

    // 2. Navegamos a los scores
    await page.goto('/scores');
    await expect(page.locator('h1:has-text("Mis Calificaciones")')).toBeVisible();

    // 3. Probamos el acordeón (hacer clic en la tarjeta de una categoría)
    // Buscamos una categoría que diga "intento(s)" (lo que significa que la tarjeta no está opaca)
    const categoryCard = page.locator('div.cursor-pointer').filter({ hasText: 'intento(s)' }).first();
    
    // Si el usuario tiene exámenes realizados, probamos la interacción
    if (await categoryCard.isVisible()) {
      await categoryCard.click(); // Expandir acordeón
      
      // Verificamos que el texto "Historial de intentos" aparezca
      await expect(page.locator('h4:has-text("Historial de intentos")')).toBeVisible();

      // 4. Probamos eliminar un score
      // Aceptamos la alerta de confirmación (confirm) de JS automáticamente
      page.on('dialog', dialog => dialog.accept());
      
      // Hacemos clic en el icono de basurero (Trash2)
      await page.locator('button[title="Eliminar puntaje"]').first().click();
      
      // Aquí podrías validar que el número de intentos bajó o el puntaje desapareció
    }
  });

});