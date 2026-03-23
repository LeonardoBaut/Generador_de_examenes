import { test, expect } from '@playwright/test';

test.describe('Validaciones de Formularios', () => {

  test('No permite crear una pregunta con IA si el tema está vacío', async ({ page }) => {
    await page.goto('/preguntas/new');

    const inputTopic = page.locator('input[name="topic"]');
    const btnGenerar = page.locator('button[type="submit"]');

    // Nos aseguramos de que el input esté vacío
    await inputTopic.fill('');

    // Intentamos enviar
    await btnGenerar.click();

    // Como tiene el atributo "required", el formulario NO debe enviarse.
    // Lo comprobamos verificando que el botón NO cambió a "Generando con IA..."
    await expect(btnGenerar).toHaveText(/Generar Pregunta Mágicamente/i);
    
    // Y verificamos que la URL sigue siendo la misma (no hubo redirección)
    await expect(page).toHaveURL(/.*\/preguntas\/new/);
  });

});