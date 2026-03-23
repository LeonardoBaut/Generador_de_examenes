import { test, expect } from '@playwright/test';

test.describe('Gestión de Preguntas (CRUD)', () => {
  
  test('Debería poder navegar a la lista y ver el botón de agregar', async ({ page }) => {
    await page.goto('/preguntas');
    
    // Verificamos que cargue el título y el botón principal
    await expect(page.locator('h1:has-text("Banco de Preguntas")')).toBeVisible();
    await expect(page.locator('a:has-text("Agregar Nueva Pregunta")')).toBeVisible();
  });

  test('Debería poder editar una pregunta existente', async ({ page }) => {
    await page.goto('/preguntas');

    // Buscamos el primer botón de "Editar" en la lista de tarjetas
    const editButton = page.locator('a:has-text("Editar")').first();
    
    // Si hay al menos una pregunta para editar, entramos a la prueba
    if (await editButton.isVisible()) {
      await editButton.click();
      
      // Verificamos que llegamos a la vista de edición (/preguntas/[id]/actualiza)
      await expect(page.locator('h1:has-text("Editar Pregunta")')).toBeVisible();

      // Modificamos un poco el texto de la pregunta
      const textarea = page.locator('textarea[name="questionText"]');
      const textoOriginal = await textarea.inputValue();
      await textarea.fill(textoOriginal + ' (Editado por Playwright)');

      // Guardamos los cambios
      await page.click('button:has-text("Guardar Cambios")');

      // Aquí podrías validar que redirige de vuelta a la lista o muestra un mensaje de éxito,
      // dependiendo de cómo esté configurado tu Server Action 'updateQuestion'
    } else {
      console.log('No hay preguntas en la base de datos para probar la edición.');
    }
  });

  test('Debería poder generar una pregunta con IA', async ({ page }) => {
    await page.goto('/preguntas/new');
    
    // Llenamos el formulario de IA
    await page.fill('input[name="topic"]', 'React Hooks y Estado Local');
    await page.selectOption('select[name="difficulty"]', 'Difícil');
    
    // Clic en el botón mágico
    const btnGenerar = page.locator('button[type="submit"]');
    await btnGenerar.click();
    
    // Validamos el estado de carga (useFormStatus)
    await expect(btnGenerar).toContainText('Generando con IA...');
    await expect(btnGenerar).toBeDisabled();
  });
});