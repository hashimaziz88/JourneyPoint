import { test, expect } from '@playwright/test';

test.describe('Unauthenticated navigation', () => {
  test('root path renders the landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });

  test('login page is accessible at /login', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  // Facilitator routes
  test('redirects /facilitator/dashboard to login', async ({ page }) => {
    await page.goto('/facilitator/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects /facilitator/hires to login', async ({ page }) => {
    await page.goto('/facilitator/hires');
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects /facilitator/pipeline to login', async ({ page }) => {
    await page.goto('/facilitator/pipeline');
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects /facilitator/plans to login', async ({ page }) => {
    await page.goto('/facilitator/plans');
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects /facilitator/markdown-import to login', async ({ page }) => {
    await page.goto('/facilitator/markdown-import');
    await expect(page).toHaveURL(/\/login/);
  });

  // Enrolee routes
  test('redirects /enrolee/my-journey to login', async ({ page }) => {
    await page.goto('/enrolee/my-journey');
    await expect(page).toHaveURL(/\/login/);
  });

  // Manager routes
  test('redirects /manager/my-tasks to login', async ({ page }) => {
    await page.goto('/manager/my-tasks');
    await expect(page).toHaveURL(/\/login/);
  });

  // Admin routes
  test('redirects /dashboard to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects /dashboard/roles to login', async ({ page }) => {
    await page.goto('/dashboard/roles');
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects /dashboard/tenants to login', async ({ page }) => {
    await page.goto('/dashboard/tenants');
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects /dashboard/users to login', async ({ page }) => {
    await page.goto('/dashboard/users');
    await expect(page).toHaveURL(/\/login/);
  });
});
