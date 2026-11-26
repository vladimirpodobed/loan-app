import { test, expect } from '@playwright/test';

test.describe('Access Control - Protected Pages', () => {

    const protectedRoutes = [
        '/loan-decision',
        '/income',
        '/decision',
    ];

    for (const route of protectedRoutes) {

        test(`should redirect unauthenticated user from ${route}`, async ({ page }) => {

            await page.goto(route);

            await expect(page).toHaveURL(/\/small-loan\/?$/);

        });

    }

});