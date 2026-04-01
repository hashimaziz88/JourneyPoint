import { test, expect } from "@playwright/test";

test.describe("Login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  // ── Structure ─────────────────────────────────────────────────────────────

  test("has the correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/JourneyPoint/i);
  });

  test("renders the sign-in form", async ({ page }) => {
    // AuthCard left column and LoginForm both render "Welcome back"; assert
    // at least one is visible.
    await expect(
      page.getByRole("heading", { name: /welcome back/i }).first(),
    ).toBeVisible();
    await expect(page.getByLabel(/email or username/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("renders the tenancy name field", async ({ page }) => {
    // Multi-tenancy is enabled by default; the field appears after session resolves.
    await expect(page.getByLabel(/tenancy name/i)).toBeVisible({
      timeout: 10000,
    });
  });

  test("renders Change Tenant and Continue as Host buttons", async ({
    page,
  }) => {
    await expect(
      page.getByRole("button", { name: /change tenant/i }),
    ).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByRole("button", { name: /continue as host/i }),
    ).toBeVisible({ timeout: 10000 });
  });

  test("renders the multi-tenancy info alert", async ({ page }) => {
    await expect(
      page.getByText(/leave the tenancy field blank for host access/i),
    ).toBeVisible({ timeout: 10000 });
  });

  // ── Field behaviour ───────────────────────────────────────────────────────

  test("remember me checkbox is checked by default", async ({ page }) => {
    await expect(
      page.getByRole("checkbox", { name: /remember me/i }),
    ).toBeChecked();
  });

  test("password field masks input", async ({ page }) => {
    const passwordInput = page.getByLabel(/^password$/i);
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("sign in button is enabled when the form is empty", async ({ page }) => {
    await expect(page.getByRole("button", { name: /sign in/i })).toBeEnabled();
  });

  test("tenancy field clears resolved status when edited", async ({ page }) => {
    const tenancyInput = page.getByLabel(/tenancy name/i);
    await tenancyInput.waitFor({ state: "visible", timeout: 10000 });
    await tenancyInput.fill("somedomain");
    // Status resets to idle on every keystroke; no resolved icon should be present.
    await expect(page.locator('[aria-label="check-circle"]')).not.toBeVisible();
  });

  // ── Validation ────────────────────────────────────────────────────────────

  test("shows validation errors when submitting empty form", async ({
    page,
  }) => {
    // Ant Design v6 form validation requires keyboard submission to trigger.
    await page.getByLabel(/email or username/i).focus();
    await page.keyboard.press("Enter");
    await expect(
      page.getByText("Please enter your email or username."),
    ).toBeVisible();
    await expect(page.getByText("Please enter your password.")).toBeVisible();
  });

  test("only shows a single validation error per empty field", async ({
    page,
  }) => {
    await page.getByLabel(/email or username/i).focus();
    await page.keyboard.press("Enter");
    const usernameErrors = page.getByText(
      "Please enter your email or username.",
    );
    await expect(usernameErrors).toHaveCount(1);
  });

  // ── Placeholders ──────────────────────────────────────────────────────────

  test("username field has a descriptive placeholder", async ({ page }) => {
    const input = page.getByLabel(/email or username/i);
    const placeholder = await input.getAttribute("placeholder");
    expect(placeholder).toBeTruthy();
  });

  test("password field has a descriptive placeholder", async ({ page }) => {
    const input = page.getByLabel(/^password$/i);
    const placeholder = await input.getAttribute("placeholder");
    expect(placeholder).toBeTruthy();
  });
});
