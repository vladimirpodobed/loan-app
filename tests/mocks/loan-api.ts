import { Page } from '@playwright/test';

// Успешный расчёт кредита
export async function mockLoanCalculation(
    page: Page,
    paymentAmountMonthly = '41.67'
): Promise<void> {
    await page.route('**/api/loan-calc**', async (route) => {

        console.log('MOCK INTERCEPTED:', route.request().url());
        console.log('MOCK METHOD:', route.request().method());

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                paymentAmountMonthly,
            }),
        });

        console.log('MOCK RESPONSE: 200');
        console.log('MOCK PAYMENT:', paymentAmountMonthly);
    });
}


// Ошибка при расчёте кредита
export async function mockLoanCalculationError(
    page: Page
): Promise<void> {
    await page.route('**/api/loan-calc**', async (route) => {

        console.log('MOCK ERROR INTERCEPTED:', route.request().url());

        await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
                message: 'Invalid loan parameters',
            }),
        });

        console.log('MOCK ERROR RESPONSE: 400');
    });
}


// Кредит одобрен
export async function mockLoanDecisionApproved(
    page: Page
): Promise<void> {
    await page.route('**/api/decisions**', async (route) => {

        console.log('DECISION MOCK INTERCEPTED:', route.request().url());

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                id: '3491452d-868b-415a-a4c3-076735473fe1',
                approved: true,
                reason: 'approved',
                createdAt: new Date().toISOString(),
            }),
        });

        console.log('DECISION MOCK RESPONSE: APPROVED');
    });
}


// Кредит отклонён
export async function mockLoanDecisionRejected(
    page: Page
): Promise<void> {
    await page.route('**/api/decisions**', async (route) => {

        console.log('DECISION MOCK INTERCEPTED:', route.request().url());

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                id: 'c04d3ec3-3759-4c2c-9d59-ef648fd10a05',
                approved: false,
                reason: 'insufficient_income',
                createdAt: new Date().toISOString(),
            }),
        });

        console.log('DECISION MOCK RESPONSE: REJECTED');
    });
}