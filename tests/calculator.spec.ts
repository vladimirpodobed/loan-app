import { test, expect } from '@playwright/test';

test.describe('Loan Calculator', () => {

    test('should calculate monthly payment using mocked API', async ({ page }) => {

        // Arrange: перехватываем запрос и возвращаем успешный ответ
        await page.route('**/api/loan-calc**', async (route) => {

            console.log('SUCCESS MOCK INTERCEPTED:', route.request().url());

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    paymentAmountMonthly: 99.99,
                }),
            });
        });

        // Arrange: открываем калькулятор
        await page.goto('/');

        // Act: нажимаем Calculate
        await page.getByRole('button', {
            name: 'Calculate',
        }).click();

        // Assert: проверяем результат расчёта
        await expect(
            page.getByText('99.99 €')
        ).toBeVisible();
    });


    test('should display error when calculation API returns 400', async ({ page }) => {

        // Arrange: перехватываем запрос и возвращаем ошибку
        await page.route('**/api/loan-calc**', async (route) => {

            console.log('ERROR MOCK INTERCEPTED:', route.request().url());

            await route.fulfill({
                status: 400,
                contentType: 'application/json',
                body: JSON.stringify({
                    message: 'Invalid loan parameters',
                }),
            });
        });

        // Arrange: открываем калькулятор
        await page.goto('/');

        // Act: нажимаем Calculate
        await page.getByRole('button', {
            name: 'Calculate',
        }).click();

        // Assert: проверяем сообщение об ошибке
        await expect(
            page.getByText(/oops, something went wrong/i)
        ).toBeVisible();
    });

});