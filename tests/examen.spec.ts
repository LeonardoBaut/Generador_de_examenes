import { test, expect } from '@playwright/test';

test.describe('Flujo de Tomar un Examen', () => {

  test('El usuario puede responder preguntas y terminar el examen', async ({ page }) => {
    // 1. Iniciamos sesión primero 
    await page.goto('/usuarios');
    await page.fill('input[name="email"]', '15ghrosita@gmail.com'); 
    await page.fill('input[name="password"]', '1q2w3e');       
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL('http://localhost:3000/', { timeout: 10000 });

    // 2. Navegamos a un examen específico (
    await page.goto('/examenes/Ciencia'); 

    // Verificamos que el título de la cabecera cargó bien
    await expect(page.locator('header').getByText(/Examen Final de/i)).toBeVisible();

    // 3. Respondemos la PRIMERA pregunta
    // Buscamos las opciones (los botones dentro del contenedor space-y-4)
    const opcionesDiv = page.locator('.space-y-4 button');
    
    // Hacemos clic en la primera opción disponible
    await opcionesDiv.first().click();

    // 4. Vamos a la SIGUIENTE pregunta
    const btnSiguiente = page.locator('button:has-text("Siguiente Pregunta")');
    
    if (await btnSiguiente.isEnabled()) {
      await btnSiguiente.click();
      
      // Respondemos la segunda pregunta (clic en la segunda opción)
      await opcionesDiv.nth(1).click();
    }

    // 5. Terminamos el Examen
    page.on('dialog', async (dialog) => {
      console.log(`Mensaje del alert: ${dialog.message()}`);
      expect(dialog.message()).toContain('¡Examen terminado!');
      await dialog.accept();
    });

    // Clic en el botón del Header
    const btnTerminar = page.locator('button:has-text("Terminar Examen")');
    await btnTerminar.click();

    // Verificamos el estado de carga
    await expect(page.locator('button:has-text("Enviando...")')).toBeVisible();

    // Tras el alert y el redirect, deberíamos volver al dashboard
    await expect(page).toHaveURL('http://localhost:3000/', { timeout: 10000 });
  });

});