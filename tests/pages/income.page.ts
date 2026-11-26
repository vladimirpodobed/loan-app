import { type Locator, type Page } from '@playwright/test';
import { DecisionPage } from './decision.page';

export class IncomePage {
    readonly page: Page;
    readonly monthlyIncomeInput: Locator;
    readonly submitButton: Locator;
    readonly backButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.monthlyIncomeInput = page.getByTestId('income-page-input');
        this.submitButton = page.getByTestId('income-page-submit-button');
        this.backButton = page.getByTestId('income-page-back-button');
    }

    async setMonthlyIncome(amount: string) {
        await this.monthlyIncomeInput.fill(amount);
    }

    async getDecision() {
        await this.submitButton.click();

        return new DecisionPage(this.page);
    }

    async goBack() {
        await this.backButton.click();
    }
}