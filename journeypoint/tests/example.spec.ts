import { test, expect } from '@playwright/test';

test.describe('Page titles', () => {
  test('login page has correct page title', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/JourneyPoint/i);
  });

  test('landing page has correct page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/JourneyPoint/i);
  });
});
