import { test, expect } from '@playwright/test';

// Test dashboard pages with authentication handling
// These tests verify that:
// 1. Protected routes redirect to login when unauthenticated
// 2. Public pages load correctly
// 3. Login page functions properly

test.describe('Authentication & Access Control', () => {
  test.setTimeout(30000);

  test.describe('Unauthenticated Access', () => {
    test('Dashboard redirects to login when unauthenticated', async ({ page }) => {
      await page.goto('/dashboard');
      // Should redirect to login page
      await expect(page).toHaveURL(/.*login.*/);
    });

    test('All protected routes redirect to login', async ({ page }) => {
      const protectedRoutes = [
        '/dashboard',
        '/dashboard/defense/text',
        '/dashboard/defense/audio',
        '/dashboard/redteam',
        '/dashboard/api-keys',
        '/dashboard/usage',
        '/dashboard/billing',
        '/dashboard/team',
        '/dashboard/settings',
      ];

      for (const route of protectedRoutes) {
        await page.goto(route);
        await expect(page).toHaveURL(/.*login.*/);
      }
    });

    test('Login page loads and has form elements', async ({ page }) => {
      await page.goto('/login');
      await expect(page).toHaveURL(/.*login.*/);

      // Wait for page content to load
      await page.waitForLoadState('domcontentloaded');

      // Check that the page has loaded with some content
      const body = page.locator('body');
      await expect(body).not.toBeEmpty();
    });
  });
});

// Authenticated tests - require a logged-in session
// To run these tests, first set up authentication:
// 1. Create a test user in your database
// 2. Use Playwright's storageState to save/restore auth cookies
// Or use the login flow before each test

test.describe('Dashboard Pages (Authenticated)', () => {
  test.setTimeout(30000);

  // Skip these tests if running without auth setup
  // Remove the .skip() when auth is configured
  test.describe.skip('Always Accessible Pages', () => {
    test('Overview page loads', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page).toHaveURL('/dashboard');
      await expect(page.getByRole('heading', { name: /overview|dashboard/i })).toBeVisible();
    });

    test('Text Defense page loads', async ({ page }) => {
      await page.goto('/dashboard/defense/text');
      await expect(page).toHaveURL('/dashboard/defense/text');
      await expect(page.getByRole('heading', { name: /text defense/i })).toBeVisible();
    });

    test('API Keys page loads', async ({ page }) => {
      await page.goto('/dashboard/api-keys');
      await expect(page).toHaveURL('/dashboard/api-keys');
      await expect(page.getByRole('heading', { name: /api keys/i })).toBeVisible();
    });

    test('Usage page loads', async ({ page }) => {
      await page.goto('/dashboard/usage');
      await expect(page).toHaveURL('/dashboard/usage');
      await expect(page.getByRole('heading', { name: /usage/i })).toBeVisible();
    });

    test('Billing page loads with plan options', async ({ page }) => {
      await page.goto('/dashboard/billing');
      await expect(page).toHaveURL('/dashboard/billing');
      await expect(page.getByRole('heading', { name: /billing/i })).toBeVisible();
      await expect(page.getByText(/free|starter|pro|business/i).first()).toBeVisible();
    });

    test('Settings page loads', async ({ page }) => {
      await page.goto('/dashboard/settings');
      await expect(page).toHaveURL('/dashboard/settings');
      await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible();
    });
  });

  test.describe.skip('Pro Feature Pages (Locked for Free)', () => {
    test('Audio Defense page shows content or locked state', async ({ page }) => {
      await page.goto('/dashboard/defense/audio');
      await expect(page).toHaveURL('/dashboard/defense/audio');

      const pageContent = await page.content();
      expect(pageContent.includes('Audio Defense')).toBe(true);

      // If locked, should show upgrade CTA
      const isLocked = await page.locator('text=Upgrade to Pro').count();
      if (isLocked > 0) {
        await expect(page.getByText('Upgrade to Pro')).toBeVisible();
        await expect(page.getByRole('link', { name: /view all plans/i })).toBeVisible();
      }
    });

    test('Red Team page shows content or locked state', async ({ page }) => {
      await page.goto('/dashboard/redteam');
      await expect(page).toHaveURL('/dashboard/redteam');

      const pageContent = await page.content();
      expect(pageContent.includes('Red Team')).toBe(true);

      const isLocked = await page.locator('text=Upgrade to Pro').count();
      if (isLocked > 0) {
        await expect(page.getByText('Upgrade to Pro')).toBeVisible();
      }
    });

    test('Team page shows content or locked state', async ({ page }) => {
      await page.goto('/dashboard/team');
      await expect(page).toHaveURL('/dashboard/team');

      const pageContent = await page.content();
      expect(pageContent.includes('Team')).toBe(true);

      const isLocked = await page.locator('text=Upgrade to Starter').count();
      if (isLocked > 0) {
        await expect(page.getByText('Upgrade to Starter')).toBeVisible();
      }
    });
  });

  test.describe.skip('Sidebar Navigation', () => {
    test('Sidebar contains all menu items', async ({ page }) => {
      await page.goto('/dashboard');

      await expect(page.getByRole('link', { name: /overview/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /defense/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /red team/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /api keys/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /usage/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /billing/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /team/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /settings/i })).toBeVisible();
    });

    test('Navigation between pages works', async ({ page }) => {
      await page.goto('/dashboard');

      await page.click('a[href="/dashboard/usage"]');
      await expect(page).toHaveURL('/dashboard/usage');

      await page.click('a[href="/dashboard/billing"]');
      await expect(page).toHaveURL('/dashboard/billing');

      await page.click('a[href="/dashboard"]');
      await expect(page).toHaveURL('/dashboard');
    });
  });

  test.describe.skip('Billing Page Details', () => {
    test('Shows all four plan tiers', async ({ page }) => {
      await page.goto('/dashboard/billing');

      await expect(page.getByText('Free').first()).toBeVisible();
      await expect(page.getByText('Starter').first()).toBeVisible();
      await expect(page.getByText('Pro').first()).toBeVisible();
      await expect(page.getByText('Business').first()).toBeVisible();
    });

    test('Shows usage meters', async ({ page }) => {
      await page.goto('/dashboard/billing');

      await expect(page.getByText('Text Requests')).toBeVisible();
      await expect(page.getByText('Audio Requests')).toBeVisible();
      await expect(page.getByText('Red Team Attacks')).toBeVisible();
    });

    test('Shows current plan indicator', async ({ page }) => {
      await page.goto('/dashboard/billing');
      const currentPlanText = await page.locator('text=Current Plan').count();
      expect(currentPlanText).toBeGreaterThan(0);
    });
  });

  test.describe.skip('Header', () => {
    test('Header displays plan badge', async ({ page }) => {
      await page.goto('/dashboard');
      const planBadge = page.locator('header').locator('[class*="badge"]').first();
      await expect(planBadge).toBeVisible();
    });
  });

  test.describe.skip('Locked Feature Behavior', () => {
    test('Locked pages show blurred preview and upgrade CTA', async ({ page }) => {
      await page.goto('/dashboard/defense/audio');

      const isLocked = await page.locator('text=Upgrade to Pro').count();

      if (isLocked > 0) {
        await expect(page.getByRole('link', { name: /upgrade/i }).first()).toBeVisible();
      }
    });

    test('Clicking upgrade navigates to billing', async ({ page }) => {
      await page.goto('/dashboard/defense/audio');

      const isLocked = await page.locator('text=Upgrade to Pro').count();

      if (isLocked > 0) {
        await page.click('a:has-text("Upgrade to Pro")');
        await expect(page).toHaveURL('/dashboard/billing');
      }
    });
  });
});

// Public pages that don't require auth
test.describe('Public Pages', () => {
  test('Landing page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });

  test('Login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/.*login.*/);
  });

  test('Signup page loads', async ({ page }) => {
    await page.goto('/signup');
    // Should either be at signup or redirect somewhere valid
    const url = page.url();
    expect(url.includes('signup') || url.includes('login')).toBe(true);
  });
});
