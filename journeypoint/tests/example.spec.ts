import { test, expect } from '@playwright/test';

test('login page has correct page title', async ({ page }) => {
  await page.goto('/login');
  await expect(page).toHaveTitle(/JourneyPoint/i);
});
