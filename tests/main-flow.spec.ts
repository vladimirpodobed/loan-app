import { test, expect } from '@playwright/test';
import { USERNAME, PASSWORD } from '../config/env-data';

import { LoanCalculatorPage } from './pages/loan-calculator.page';
import { LoginPopupPage } from './pages/login-popup.page';
import { FinalPage } from './pages/final-page.page';

import fs from 'fs';
import path from 'path';


test('network logging', async ({ page }) => {
    const networkLog: string[] = [];

    page.on('request', (request) => {
        networkLog.push(
            `REQUEST: ${request.method()} ${request.url()}`
        );
    });

    page.on('response', (response) => {
        networkLog.push(
            `RESPONSE: ${response.status()} ${response.url()}`
        );
    });

    const loanCalculator = new LoanCalculatorPage(page);

    await loanCalculator.goto();
    await page.waitForTimeout(2000);

    const logDirectory = path.resolve(__dirname, '../test-results');

    fs.mkdirSync(logDirectory, { recursive: true });

    fs.writeFileSync(
        path.join(logDirectory, 'network-log.txt'),
        networkLog.join('\n'),
        'utf-8'
    );

    console.log(`Network events saved: ${networkLog.length}`);
});


test('main flow', async ({ page }) => {
    // Page Objects
    const loanCalculator = new LoanCalculatorPage(page);
    const loginPopup = new LoginPopupPage(page);

    // 1. Open Loan Calculator
    await loanCalculator.goto();

    // 2. Set loan parameters
    await loanCalculator.setAmount('500');
    await loanCalculator.setPeriod('12');

    // 3. Calculate loan
    await loanCalculator.calculate();

    await expect(loanCalculator.monthlyPayment).toContainText('€', {
        timeout: 15000,
    });

    await expect(loanCalculator.errorMessage).toHaveCount(0);
    await expect(loanCalculator.applyButton).toBeEnabled();

    // 4. Apply for loan
    await loanCalculator.apply();

    // 5. Login
    await expect(loginPopup.usernameInput).toBeVisible();

    const finalPage = await loginPopup.login(USERNAME, PASSWORD);

    // 6. Verify Loan Details
    await expect(page).toHaveURL(/loan-decision/);

    await expect(finalPage.amount).toHaveText('500 €');
    await expect(finalPage.monthlyPayment).toContainText('€');
    await expect(finalPage.period).toHaveText('12 months');
    await expect(finalPage.fullName).toBeVisible();

    // 7. Continue to Income Page
    const incomePage = await finalPage.continue();

    // 8. Verify Income Page
    await expect(incomePage.monthlyIncomeInput).toBeVisible();
    await expect(incomePage.submitButton).toBeDisabled();

    // 9. Enter Monthly Income
    await incomePage.setMonthlyIncome('2000');

    await expect(incomePage.submitButton).toBeEnabled();

    // 10. Get Decision
    const decisionPage = await incomePage.getDecision();

    // 11. Verify Decision Page
    await expect(decisionPage.okButton).toBeVisible();
    await expect(decisionPage.title).toBeVisible();
});


test('redirect flow', async ({ page }) => {
    const loanCalculator = new LoanCalculatorPage(page);

    await loanCalculator.goto();

    await loanCalculator.clickImageButton1();

    await expect(loanCalculator.applyButton).toBeInViewport();

    await loanCalculator.clickImageButton2();

    await expect(loanCalculator.applyButton).toBeInViewport();
});