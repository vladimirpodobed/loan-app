import { test, expect, Page } from '@playwright/test';

import { LoanCalculatorPage } from './pages/loan-calculator.page';
import { LoginPopupPage } from './pages/login-popup.page';

async function openLoginPopup(page: Page): Promise<LoginPopupPage> {
    const loanCalculator = new LoanCalculatorPage(page);

    await loanCalculator.goto();
    await loanCalculator.setAmount('500');
    await loanCalculator.setPeriod('12');
    await loanCalculator.calculate();

    await expect(loanCalculator.applyButton).toBeEnabled();
    await loanCalculator.apply();

    const loginPopup = new LoginPopupPage(page);

    await expect(loginPopup.usernameInput).toBeVisible();
    await expect(loginPopup.passwordInput).toBeVisible();

    return loginPopup;
}

test.describe('Login - Negative Authentication Tests', () => {

    test('should reject incorrect username', async ({ page }) => {
        const loginPopup = await openLoginPopup(page);

        await loginPopup.usernameInput.fill('wrongusername');
        await loginPopup.passwordInput.fill('Tallinn1');

        await expect(loginPopup.continueButton).toBeEnabled();

        await loginPopup.continueButton.click();

        await expect(loginPopup.usernameInput).toBeVisible();
        await expect(page).not.toHaveURL(/\/loan-decision(?:\/|$)/);
    });

    test('should reject incorrect password', async ({ page }) => {
        const loginPopup = await openLoginPopup(page);

        await loginPopup.usernameInput.fill('anna');
        await loginPopup.passwordInput.fill('wrongpassword');

        await expect(loginPopup.continueButton).toBeEnabled();

        await loginPopup.continueButton.click();

        await expect(loginPopup.usernameInput).toBeVisible();
        await expect(page).not.toHaveURL(/\/loan-decision(?:\/|$)/);
    });

    test('should reject incorrect username and password', async ({ page }) => {
        const loginPopup = await openLoginPopup(page);

        await loginPopup.usernameInput.fill('wrongusername');
        await loginPopup.passwordInput.fill('wrongpassword');

        await expect(loginPopup.continueButton).toBeEnabled();

        await loginPopup.continueButton.click();

        await expect(loginPopup.usernameInput).toBeVisible();
        await expect(page).not.toHaveURL(/\/loan-decision(?:\/|$)/);
    });

});