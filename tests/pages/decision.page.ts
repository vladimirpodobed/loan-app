import { type Locator, type Page } from '@playwright/test';

export class DecisionPage {
    readonly page: Page;
    readonly title: Locator;
    readonly okButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.title = page.getByTestId('decision-page-title');
        this.okButton = page.getByTestId('decision-page-ok-button');
    }

    async confirm() {
        await this.okButton.click();
    }
}