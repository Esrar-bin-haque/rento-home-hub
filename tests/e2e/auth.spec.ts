import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
  test('Register form renders correctly', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('h1')).toContainText(/create account|register/i);
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="tel"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toHaveCount(2);
  });

  test('Login form renders correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText(/welcome|login/i);
    await expect(page.locator('input[type="tel"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});