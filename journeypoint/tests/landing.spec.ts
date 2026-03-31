import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders the main hero heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /onboarding that works for teams/i })).toBeVisible();
  });

  test('renders the platform features section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /everything your team needs to onboard well/i })).toBeVisible();
    await expect(page.getByText('Onboarding Plans')).toBeVisible();
    await expect(page.getByText('Hire Management')).toBeVisible();
    await expect(page.getByText('Live Pipeline')).toBeVisible();
  });

  test('renders the CTA section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /ready to run better onboarding/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /sign in to your workspace/i })).toBeVisible();
  });

  test('nav sign in link points to /login', async ({ page }) => {
    const signInLink = page.getByRole('navigation').getByRole('link', { name: /sign in/i });
    await expect(signInLink).toHaveAttribute('href', /\/login/);
  });

  test('get started link points to /login', async ({ page }) => {
    const getStarted = page.getByRole('link', { name: /get started/i });
    await expect(getStarted).toHaveAttribute('href', /\/login/);
  });

  test('renders footer with copyright notice', async ({ page }) => {
    await expect(page.getByText(/JourneyPoint/i).last()).toBeVisible();
  });
});
