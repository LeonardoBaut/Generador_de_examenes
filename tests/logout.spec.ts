import { test, expect } from '@playwright/test';

test.describe('Cierre de Sesión', () => {
  test('Debería cerrar sesión y eliminar la cookie del navegador', async ({ page, context }) => {
    
    // 1. Primero iniciamos sesión rápido
    await page.goto('/usuarios');
    
    await page.fill('input[name="email"]', '15ghrosita@gmail.com');
    await page.fill('input[name="password"]', '1q2w3e');

    await page.click('button:has-text("Sign In")'); 
    
    await expect(page).toHaveURL('http://localhost:3000/');

    // 2. Hacemos clic en el botón de Cerrar Sesión

    await page.click('button:has-text("Cerrar Sesión")');

    // 3. Verificamos que el sistema nos redirija de vuelta a la pantalla de login/usuarios
    await expect(page).toHaveURL('http://localhost:3000/usuarios');

    // 4. Revisamos las cookies internas para asegurarnos de que "user_session" ya no existe
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name === 'user_session');
    
    expect(sessionCookie).toBeUndefined(); 
  });
});