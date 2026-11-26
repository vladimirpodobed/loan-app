import { type Locator, type Page } from '@playwright/test';
import { IncomePage } from './income.page';

export class FinalPage {
    readonly page: Page;
    readonly amount: Locator;
    readonly monthlyPayment: Locator;
    readonly period: Locator;
    readonly fullName: Locator;
    readonly communicationLanguage: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.amount = page.getByTestId('final-page-amount');
        this.monthlyPayment = page.getByTestId('final-page-monthly-payment');
        this.period = page.getByTestId('final-page-period');
        this.fullName = page.getByTestId('final-page-full-name');
        this.communicationLanguage = page.getByTestId(
            'final-page-communication-language'
        );
        this.continueButton = page.getByTestId('final-page-continue-button');
    }

    async continue() {
        await this.continueButton.click();

        return new IncomePage(this.page);
    }

    async selectLanguage(language: 'English' | 'Russian' | 'Estonian') {
        await this.communicationLanguage.selectOption({ label: language });
    }
}