import { test, expect } from '@playwright/test';

async function login(page: any) {
  await page.addInitScript(() => {
    localStorage.setItem('rento_current_org', 'test-org-id');
  });
  await page.goto('/management');
}

test.describe('Buildings Flow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Management page renders with sidebar', async ({ page }) => {
    await page.goto('/management');
    await expect(page.locator('aside')).toBeVisible();
  });
});