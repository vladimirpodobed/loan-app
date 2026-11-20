import { type Page, type Locator } from '@playwright/test';

export class LoanCalculatorPage {
    readonly page: Page;

    // Locators
// Locators
    readonly amountInput: Locator;
    readonly amountSlider: Locator;
    readonly periodSelect: Locator;
    readonly periodSlider: Locator;
    readonly monthlyPayment: Locator;
    readonly calculateButton: Locator;
    readonly applyButton: Locator;
    readonly imageButton1: Locator;
    readonly imageButton2: Locator;
    readonly errorMessage: Locator;


    constructor(page: Page) {
        this.page = page;

        this.amountInput = page.getByTestId(
            'id-small-loan-calculator-field-amount'
        );

        this.amountSlider = page.getByTestId(
            'id-small-loan-calculator-field-amount-slider'
        );

        this.periodSelect = page.getByTestId(
            'ib-small-loan-calculator-field-period'
        );

        this.periodSlider = page.getByTestId(
            'ib-small-loan-calculator-field-period-slider'
        );

        this.monthlyPayment = page.getByTestId(
            'ib-small-loan-calculator-field-monthlyPayment'
        );

        this.calculateButton = page.getByTestId(
            'id-small-loan-calculator-field-calculate'
        );
        this.applyButton = page.getByTestId(
            'id-small-loan-calculator-field-apply'
        );

        this.imageButton1 = page.getByTestId(
            'id-image-element-button-image-1'
        );

        this.imageButton2 = page.getByTestId(
            'id-image-element-button-image-2'
        );

        this.errorMessage = page.getByTestId(
            'id-small-loan-calculator-field-error'
        );
    }

    // Navigation
    async goto() {
        await this.page.goto('/');
    }

    // Actions
    async setAmount(amount: string) {
        await this.amountInput.fill(amount);
    }

    async setPeriod(period: string) {
        await this.periodSelect.selectOption(period);
    }

    async setAmountSlider(amount: string) {
        await this.amountSlider.fill(amount);
    }

    async setPeriodSlider(period: string) {
        await this.periodSlider.fill(period);
    }

    async calculate() {
        await this.calculateButton.click();
    }

    async apply() {
        await this.applyButton.click();
    }

    async clickImageButton1() {
        await this.imageButton1.click();
    }

    async clickImageButton2() {
        await this.imageButton2.click();
    }
}