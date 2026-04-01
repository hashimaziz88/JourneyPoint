import { test, expect } from '@playwright/test';

// Verifies ARIA and semantic HTML conventions on the public pages.
// All assertions run without a backend so session state is unauthenticated.

test.describe('Accessibility — login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('logo image has a non-empty alt attribute', async ({ page }) => {
    const logo = page.getByRole('img', { name: /JourneyPoint/i }).first();
    await expect(logo).toBeVisible();
    const alt = await logo.getAttribute('alt');
    expect(alt).toBeTruthy();
  });

  test('email / username input has an associated label', async ({ page }) => {
    const input = page.getByLabel(/email or username/i);
    await expect(input).toBeVisible();
  });

  test('password input has an associated label', async ({ page }) => {
    const input = page.getByLabel(/^password$/i);
    await expect(input).toBeVisible();
  });

  test('password input masks its value', async ({ page }) => {
    await expect(page.getByLabel(/^password$/i)).toHaveAttribute('type', 'password');
  });

  test('remember me checkbox has an accessible label', async ({ page }) => {
    await expect(page.getByRole('checkbox', { name: /remember me/i })).toBeVisible();
  });

  test('sign in button has an accessible name', async ({ page }) => {
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('tenancy name input has an associated label', async ({ page }) => {
    // Multi-tenancy is enabled by default; wait for session to resolve.
    await expect(page.getByLabel(/tenancy name/i)).toBeVisible({ timeout: 10000 });
  });

  test('Change Tenant button has an accessible name', async ({ page }) => {
    await expect(page.getByRole('button', { name: /change tenant/i })).toBeVisible({ timeout: 10000 });
  });

  test('Continue as Host button has an accessible name', async ({ page }) => {
    await expect(page.getByRole('button', { name: /continue as host/i })).toBeVisible({ timeout: 10000 });
  });

  test('auth card renders a back-link to the home page', async ({ page }) => {
    const homeLink = page.getByRole('link', { name: /JourneyPoint/i }).first();
    await expect(homeLink).toHaveAttribute('href', '/');
  });

  test('auth card tagline is visible', async ({ page }) => {
    await expect(page.getByText(/the structured onboarding platform/i)).toBeVisible();
  });
});

test.describe('Accessibility — landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('nav logo image has a non-empty alt attribute', async ({ page }) => {
    const logos = page.getByRole('img', { name: /JourneyPoint/i });
    const count = await logos.count();
    expect(count).toBeGreaterThanOrEqual(1);
    for (let i = 0; i < count; i++) {
      const alt = await logos.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('nav element is present', async ({ page }) => {
    await expect(page.locator('nav').first()).toBeVisible();
  });

  test('footer element is present', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
  });

  test('all top-level CTA links have discernible text', async ({ page }) => {
    const ctaLinks = [
      page.getByRole('link', { name: /sign in/i }).first(),
      page.getByRole('link', { name: /get started/i }),
      page.getByRole('link', { name: /sign in to your workspace/i }),
    ];
    for (const link of ctaLinks) {
      await expect(link).toBeVisible();
    }
  });

  test('feature headings are rendered as level-4 headings', async ({ page }) => {
    for (const name of ['Onboarding Plans', 'Hire Management', 'Live Pipeline']) {
      await expect(page.getByRole('heading', { name, level: 4 })).toBeVisible();
    }
  });

  test('stats section percentage value is readable text (not an image)', async ({ page }) => {
    // Stat values are plain text, not SVG or images.
    await expect(page.getByText('100%')).toBeVisible();
    await expect(page.getByText('4')).toBeVisible();
    await expect(page.getByText('Multi')).toBeVisible();
  });

  test('features section is reachable via anchor link', async ({ page }) => {
    // The "See What's Included" button points to #features.
    const seeIncluded = page.getByRole('link', { name: /see what.s included/i });
    const href = await seeIncluded.getAttribute('href');
    expect(href).toMatch(/#features/);
  });
});
