import { test, expect } from '@playwright/test';

test.describe('Google OAuth Flow', () => {
  test('Login page does not have Google OAuth (no backend)', async ({ page }) => {
    await page.goto('/login');
    
    const googleBtn = page.locator('button:has-text("Google"), a:has-text("Google")');
    await expect(googleBtn).not.toBeVisible();
  });
});