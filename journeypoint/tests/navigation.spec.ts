import { test, expect } from '@playwright/test';

test.describe('Unauthenticated navigation', () => {
  test('root path renders the landing page', async ({ page }) => {
    await page.goto('/');
    // / is a public landing page, not an auth-gated redirect
    await expect(page).toHaveURL('/');
  });

  test('login page is accessible at /login', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('redirects protected facilitator route to login', async ({ page }) => {
    await page.goto('/facilitator/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects protected enrolee route to login', async ({ page }) => {
    await page.goto('/enrolee/my-journey');
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects protected manager route to login', async ({ page }) => {
    await page.goto('/manager/my-tasks');
    await expect(page).toHaveURL(/\/login/);
  });
});
