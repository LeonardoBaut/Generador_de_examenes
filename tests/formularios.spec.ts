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

    await expect(btnGenerar).toHaveText(/Generar Pregunta Mágicamente/i);
    
    // Y verificamos que la URL sigue siendo la misma 
    await expect(page).toHaveURL(/.*\/preguntas\/new/);
  });

});