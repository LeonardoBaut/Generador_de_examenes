import { test, expect } from '@playwright/test';

test.describe('Interfaz de Generación con IA', () => {
  test('Debería mostrar el estado de carga al enviar el formulario', async ({ page }) => {
    await page.goto('/preguntas/new');

    // Llenamos los datos del cuestionario
    await page.fill('input[name="topic"]', 'React Hooks');
    await page.selectOption('select[name="difficulty"]', 'Difícil');

    // Hacemos clic en el botón principal
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Verificamos inmediatamente que el botón cambie su texto al estado de carga
    // Esto valida que tu hook useFormStatus de React 19 está funcionando perfecto
    await expect(submitButton).toHaveText(/Generando con IA\.\.\./);
    
    // Verificamos que el botón se haya deshabilitado para evitar doble clic
    await expect(submitButton).toBeDisabled();
  });
});