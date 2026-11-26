import { test, expect } from '@playwright/test';

test.describe('Loan Calculator API - Response Validation', () => {

    const apiUrl = 'https://backend.tallinn-learning.ee/api/loan-calc';

    // Проверка структуры, типа и ожидаемого значения ответа
    async function validateSuccessfulResponse(
        response: any,
        expectedPayment: number
    ) {
        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody).toHaveProperty('paymentAmountMonthly');
        expect(typeof responseBody.paymentAmountMonthly).toBe('number');
        expect(Number.isFinite(responseBody.paymentAmountMonthly)).toBe(true);
        expect(responseBody.paymentAmountMonthly).toBeGreaterThan(0);

        // Проверяем соответствие контрольному значению
        expect(responseBody.paymentAmountMonthly).toBeCloseTo(
            expectedPayment,
            2
        );

        console.log('Validated API response:', responseBody);
    }

    test('should accept minimum loan amount: 500', async ({ request }) => {
        const response = await request.get(apiUrl, {
            params: { amount: 500, period: 12 },
        });

        await validateSuccessfulResponse(response, 42.80);
    });

    test('should accept maximum loan amount: 10000', async ({ request }) => {
        const response = await request.get(apiUrl, {
            params: { amount: 10000, period: 12 },
        });

        await validateSuccessfulResponse(response, 856.07);
    });

    test('should reject loan amount below minimum: 499', async ({ request }) => {
        const response = await request.get(apiUrl, {
            params: { amount: 499, period: 12 },
        });

        expect(response.status()).toBe(400);
    });

    test('should accept minimum loan period: 12', async ({ request }) => {
        const response = await request.get(apiUrl, {
            params: { amount: 500, period: 12 },
        });

        await validateSuccessfulResponse(response, 42.80);
    });

    test('should accept maximum loan period: 36', async ({ request }) => {
        const response = await request.get(apiUrl, {
            params: { amount: 500, period: 36 },
        });

        await validateSuccessfulResponse(response, 14.99);
    });

    test('should reject loan period below minimum: 11', async ({ request }) => {
        const response = await request.get(apiUrl, {
            params: { amount: 500, period: 11 },
        });

        expect(response.status()).toBe(400);
    });

    test('should reject loan period above maximum: 37', async ({ request }) => {
        const response = await request.get(apiUrl, {
            params: { amount: 500, period: 37 },
        });

        expect(response.status()).toBe(400);
    });

});
