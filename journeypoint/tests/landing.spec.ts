import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ── Meta ──────────────────────────────────────────────────────────────────

  test('has the correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/JourneyPoint/i);
  });

  // ── Navigation ────────────────────────────────────────────────────────────

  test('nav sign in link points to /login', async ({ page }) => {
    const signInLink = page.getByRole('navigation').getByRole('link', { name: /sign in/i });
    await expect(signInLink).toHaveAttribute('href', /\/login/);
  });

  // ── Hero ──────────────────────────────────────────────────────────────────

  test('renders the main hero heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /onboarding that works for teams/i })).toBeVisible();
  });

  test('renders the hero eyebrow text', async ({ page }) => {
    await expect(page.getByText(/structured onboarding for people-first teams/i)).toBeVisible();
  });

  test('renders the hero subtitle', async ({ page }) => {
    await expect(page.getByText(/JourneyPoint gives HR Facilitators/i)).toBeVisible();
  });

  test('renders the hero panel heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /built for real onboarding operations/i })).toBeVisible();
  });

  test('renders all hero highlight list items', async ({ page }) => {
    await expect(page.getByText('Role-aware onboarding actions')).toBeVisible();
    await expect(page.getByText('Audit-friendly journey updates')).toBeVisible();
    await expect(page.getByText('Manager and HR Facilitator workspaces')).toBeVisible();
  });

  test('get started link points to /login', async ({ page }) => {
    const getStarted = page.getByRole('link', { name: /get started/i });
    await expect(getStarted).toHaveAttribute('href', /\/login/);
  });

  test('see what\'s included button is visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: /see what.s included/i })).toBeVisible();
  });

  // ── Features section ──────────────────────────────────────────────────────

  test('renders the platform features label', async ({ page }) => {
    await expect(page.getByText('Platform Features')).toBeVisible();
  });

  test('renders the features section heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /everything your team needs to onboard well/i })).toBeVisible();
  });

  test('renders all three feature cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Onboarding Plans' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Hire Management' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Live Pipeline' })).toBeVisible();
  });

  test('features section has a valid anchor id', async ({ page }) => {
    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeVisible();
  });

  // ── Stats section ─────────────────────────────────────────────────────────

  test('renders the role-aware workspaces stat', async ({ page }) => {
    await expect(page.getByText('4')).toBeVisible();
    await expect(page.getByText('Role-aware workspaces')).toBeVisible();
  });

  test('renders the multi-tenant ready stat', async ({ page }) => {
    await expect(page.getByText('Multi')).toBeVisible();
    await expect(page.getByText('Tenant ready')).toBeVisible();
  });

  // ── CTA section ───────────────────────────────────────────────────────────

  test('renders the CTA heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /ready to run better onboarding/i })).toBeVisible();
  });

  test('renders the CTA subtitle', async ({ page }) => {
    await expect(page.getByText(/sign in with your account or contact your/i)).toBeVisible();
  });

  test('CTA sign in link points to /login', async ({ page }) => {
    const ctaLink = page.getByRole('link', { name: /sign in to your workspace/i });
    await expect(ctaLink).toHaveAttribute('href', /\/login/);
  });

  // ── Footer ────────────────────────────────────────────────────────────────

  test('renders footer with copyright notice', async ({ page }) => {
    const currentYear = new Date().getFullYear().toString();
    await expect(page.getByText(new RegExp(currentYear))).toBeVisible();
  });

  test('renders footer JourneyPoint text', async ({ page }) => {
    await expect(page.getByText(/JourneyPoint/i).last()).toBeVisible();
  });

  test('renders footer tagline', async ({ page }) => {
    await expect(page.getByText(/structured onboarding for modern teams/i)).toBeVisible();
  });
});
