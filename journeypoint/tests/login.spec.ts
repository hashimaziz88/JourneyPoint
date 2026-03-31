import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('renders the sign-in form', async ({ page }) => {
    // The AuthCard left column and LoginForm both render "Welcome back" as h2;
    // assert at least one is visible.
    await expect(page.getByRole('heading', { name: /welcome back/i }).first()).toBeVisible();
    await expect(page.getByLabel(/email or username/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('shows validation errors when submitting empty form', async ({ page }) => {
    // Ant Design v6 form validation requires keyboard submission to trigger
    await page.getByLabel(/email or username/i).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText('Please enter your email or username.')).toBeVisible();
    await expect(page.getByText('Please enter your password.')).toBeVisible();
  });

  test('remember me checkbox is checked by default', async ({ page }) => {
    await expect(page.getByRole('checkbox', { name: /remember me/i })).toBeChecked();
  });
});
