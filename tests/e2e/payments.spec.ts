import { test, expect } from '@playwright/test';

test.describe('Payments Flow', () => {
  test('Management page renders', async ({ page }) => {
    await page.goto('/management');
    await expect(page.locator('aside')).toBeVisible();
  });
});