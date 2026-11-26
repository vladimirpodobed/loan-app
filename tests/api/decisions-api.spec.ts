import { test, expect } from '@playwright/test';

import { USERNAME, PASSWORD } from '../../config/env-data';
import { LoanCalculatorPage } from '../pages/loan-calculator.page';
import { LoginPopupPage } from '../pages/login-popup.page';
import { FinalPage } from '../pages/final-page.page';

test.describe('Loan Decisions API - Response Validation', () => {

    const apiUrl = 'https://loan-decision.tl-academy.ee/api/decisions';

    async function validateDecisionResponse(
        response: any,
        expectedId: string,
        expectedApproved: boolean,
        expectedReason: string
    ) {
        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody).toHaveProperty('id');
        expect(responseBody).toHaveProperty('approved');
        expect(responseBody).toHaveProperty('reason');
        expect(responseBody).toHaveProperty('createdAt');

        expect(typeof responseBody.id).toBe('string');
        expect(typeof responseBody.approved).toBe('boolean');
        expect(typeof responseBody.reason).toBe('string');
        expect(typeof responseBody.createdAt).toBe('string');

        expect(responseBody.id).toBe(expectedId);
        expect(responseBody.approved).toBe(expectedApproved);
        expect(responseBody.reason).toBe(expectedReason);

        expect(responseBody.createdAt).toMatch(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/
        );

        expect(Number.isNaN(Date.parse(responseBody.createdAt))).toBe(false);

        console.log('Validated decision response:', responseBody);
    }

    test('should approve loan when income is sufficient', async ({ request }) => {

        const requestBody = {
            id: '3491452d-868b-415a-a4c3-076735473fe1',
            clientId: 'username:anna',
            amount: 1791,
            income: 2000,
            monthlyPayment: 93.52,
            period: 20,
        };

        const response = await request.post(apiUrl, {
            data: requestBody,
        });

        await validateDecisionResponse(
            response,
            requestBody.id,
            true,
            'approved'
        );
    });

    test('should reject loan when income is insufficient', async ({ request }) => {

        const requestBody = {
            id: 'c04d3ec3-3759-4c2c-9d59-ef648fd10a05',
            clientId: 'username:anna',
            amount: 3930,
            income: 11,
            monthlyPayment: 172.41,
            period: 24,
        };

        const response = await request.post(apiUrl, {
            data: requestBody,
        });

        await validateDecisionResponse(
            response,
            requestBody.id,
            false,
            'insufficient_income'
        );
    });

});


test.describe('Loan Decisions API - Negative Input Validation', () => {

    const apiUrl = 'https://loan-decision.tl-academy.ee/api/decisions';

    const basePayload = {
        clientId: 'username:anna',
        amount: 1791,
        income: 2000,
        monthlyPayment: 93.52,
        period: 20,
    };

    test('should reject application when income is missing', async ({ request }) => {

        const response = await request.post(apiUrl, {
            data: {
                id: 'a1111111-1111-4111-8111-111111111111',
                clientId: basePayload.clientId,
                amount: basePayload.amount,
                monthlyPayment: basePayload.monthlyPayment,
                period: basePayload.period,
            },
        });

        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('error', 'Invalid application');
    });

    test('should reject application when income is zero', async ({ request }) => {

        const response = await request.post(apiUrl, {
            data: {
                ...basePayload,
                id: 'a2222222-2222-4222-8222-222222222222',
                income: 0,
            },
        });

        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('error', 'Invalid application');
    });

    test('should reject application when income is negative', async ({ request }) => {

        const response = await request.post(apiUrl, {
            data: {
                ...basePayload,
                id: 'a3333333-3333-4333-8333-333333333333',
                income: -100,
            },
        });

        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('error', 'Invalid application');
    });

    test('should reject application when clientId is missing', async ({ request }) => {

        const response = await request.post(apiUrl, {
            data: {
                id: 'a4444444-4444-4444-8444-444444444444',
                amount: basePayload.amount,
                income: basePayload.income,
                monthlyPayment: basePayload.monthlyPayment,
                period: basePayload.period,
            },
        });

        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('error', 'Invalid application');
    });

    test('should reject application when loan amount is negative', async ({ request }) => {

        const response = await request.post(apiUrl, {
            data: {
                ...basePayload,
                id: 'a5555555-5555-4555-8555-555555555555',
                amount: -500,
            },
        });

        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('error', 'Invalid application');
    });

});


test.describe('Loan Decisions API - Business Logic Investigation', () => {

    const apiUrl = 'https://loan-decision.tl-academy.ee/api/decisions';

    const testCases = [
        {
            name: 'Income is twice the monthly payment',
            id: 'b1111111-1111-4111-8111-111111111111',
            income: 200,
            monthlyPayment: 100,
        },
        {
            name: 'Income equals monthly payment',
            id: 'b2222222-2222-4222-8222-222222222222',
            income: 100,
            monthlyPayment: 100,
        },
        {
            name: 'Income is slightly lower than monthly payment',
            id: 'b3333333-3333-4333-8333-333333333333',
            income: 99,
            monthlyPayment: 100,
        },
        {
            name: 'Income is 50 percent higher than monthly payment',
            id: 'b4444444-4444-4444-8444-444444444444',
            income: 150,
            monthlyPayment: 100,
        },
    ];

    for (const testCase of testCases) {

        test(`investigate decision: ${testCase.name}`, async ({ request }) => {

            const requestBody = {
                id: testCase.id,
                clientId: 'username:anna',
                amount: 1000,
                income: testCase.income,
                monthlyPayment: testCase.monthlyPayment,
                period: 12,
            };

            const response = await request.post(apiUrl, {
                data: requestBody,
            });

            const responseBody = await response.text();

            console.log('-----------------------------------');
            console.log('SCENARIO:', testCase.name);
            console.log('INCOME:', testCase.income);
            console.log('MONTHLY PAYMENT:', testCase.monthlyPayment);
            console.log('HTTP STATUS:', response.status());
            console.log('API RESPONSE:', responseBody);
        });
    }

});


test.describe('Loan Decisions API - Income Investigation', () => {

    const apiUrl = 'https://loan-decision.tl-academy.ee/api/decisions';

    const incomes = [200, 300, 500, 1000, 2000];

    for (const income of incomes) {

        test(`investigate decision with income ${income}`, async ({ request }) => {

            const requestBody = {
                id: `c${String(income).padStart(3, '0')}1111-1111-4111-8111-111111111111`,
                clientId: 'username:anna',
                amount: 1000,
                income,
                monthlyPayment: 100,
                period: 12,
            };

            const response = await request.post(apiUrl, {
                data: requestBody,
            });

            const responseBody = await response.json();

            console.log('-----------------------------------');
            console.log('INCOME:', income);
            console.log('MONTHLY PAYMENT:', requestBody.monthlyPayment);
            console.log('AMOUNT:', requestBody.amount);
            console.log('PERIOD:', requestBody.period);
            console.log('HTTP STATUS:', response.status());
            console.log('APPROVED:', responseBody.approved);
            console.log('REASON:', responseBody.reason);
        });
    }

});


test.describe('Loan Decisions API - Request Tampering', () => {

    test('BUG-02: should reject loan when monthlyPayment is modified by client', async ({ page }) => {

        // Известный дефект: сервер доверяет monthlyPayment из клиентского запроса
        test.fail();

        let originalMonthlyPayment: number | undefined;
        let tamperedMonthlyPayment: number | undefined;

        // Arrange: перехватываем запрос и изменяем monthlyPayment
        await page.route('**/api/decisions**', async (route) => {

            const request = route.request();

            if (request.method() !== 'POST') {
                await route.continue();
                return;
            }

            const requestBody = request.postDataJSON();

            originalMonthlyPayment = requestBody.monthlyPayment;

            const tamperedRequestBody = {
                ...requestBody,
                monthlyPayment: 1,
            };

            tamperedMonthlyPayment = tamperedRequestBody.monthlyPayment;

            console.log('ORIGINAL MONTHLY PAYMENT:', originalMonthlyPayment);
            console.log('TAMPERED MONTHLY PAYMENT:', tamperedMonthlyPayment);

            // Отправляем изменённый запрос настоящему серверу
            await route.continue({
                postData: JSON.stringify(tamperedRequestBody),
            });
        });

        // Arrange: открываем калькулятор
        const calculator = new LoanCalculatorPage(page);

        await calculator.goto();
        await calculator.setAmount('3930');
        await calculator.setPeriod('24');
        await calculator.calculate();

        await expect(calculator.applyButton).toBeEnabled();

        // Act: авторизуемся
        await calculator.apply();

        const loginPopup = new LoginPopupPage(page);

        await loginPopup.usernameInput.fill(USERNAME);
        await loginPopup.passwordInput.fill(PASSWORD);
        await loginPopup.continueButton.click();

        // Arrange: переходим к вводу дохода
        const finalPage = new FinalPage(page);

        await expect(finalPage.continueButton).toBeVisible();

        const incomePage = await finalPage.continue();

        await incomePage.setMonthlyIncome('11');

        // Act: отправляем заявку
        const decisionResponsePromise = page.waitForResponse((response) =>
            response.url().includes('/api/decisions') &&
            response.request().method() === 'POST'
        );

        await incomePage.getDecision();

        const decisionResponse = await decisionResponsePromise;
        const responseBody = await decisionResponse.json();

        // Assert: проверяем подмену и бизнес-результат
        expect(originalMonthlyPayment).toBeGreaterThan(1);
        expect(tamperedMonthlyPayment).toBe(1);

        expect(decisionResponse.status()).toBe(200);

        console.log('API RESPONSE:', responseBody);
        console.log('APPROVED:', responseBody.approved);
        console.log('REASON:', responseBody.reason);

        // Сервер должен отклонить заявку с недостаточным доходом
        expect(responseBody.approved).toBe(false);
    });

});
