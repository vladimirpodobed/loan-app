import { type Locator, type Page } from '@playwright/test';
import { FinalPage } from './final-page.page';

export class LoginPopupPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly continueButton: Locator;
    readonly closeButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.usernameInput = page.getByTestId('login-popup-username-input');
        this.passwordInput = page.getByTestId('login-popup-password-input');
        this.continueButton = page.getByTestId('login-popup-continue-button');
        this.closeButton = page.getByTestId('login-popup-close-button');
    }

    async login(username: string, password: string): Promise<FinalPage> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.continueButton.click();

        return new FinalPage(this.page);
    }

    async close(): Promise<void> {
        await this.closeButton.click();
    }
}