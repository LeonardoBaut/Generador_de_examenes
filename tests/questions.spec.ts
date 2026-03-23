import { test, expect } from '@playwright/test';

test.describe('CRUD de Preguntas', () => {
  test('Debería permitir eliminar una pregunta de la lista', async ({ page }) => {
    // 1. Navegamos a la lista de preguntas
    await page.goto('/preguntas');

    // 2. Contamos cuántas preguntas hay inicialmente (buscando las tarjetas o filas)
    const initialCount = await page.locator('.question-card').count();

    // Si hay al menos una pregunta, intentamos borrar la primera
    if (initialCount > 0) {
      // 3. Hacemos clic en el botón de eliminar de la primera pregunta
      page.on('dialog', dialog => dialog.accept());
      
      await page.locator('.question-card').first().locator('button:has-text("Eliminar")').click();

      // 4. Esperamos a que la página se actualice (revalidatePath hace esto rápido)
      await expect(page.locator('.question-card')).toHaveCount(initialCount - 1);
    }
  });
});