import { expect, test } from '@playwright/test';
import { BasePage } from './BasePage';
import loginData from '../testdata/loginTestData.json';

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.locator(loginData.locators.usernameInput);
    this.passwordInput = page.locator(loginData.locators.passwordInput);
    this.loginButton = page.locator(loginData.locators.loginButton);
  }
  

  async goto() {
    await this.page.goto(loginData.data.url);
    await this.attachScreenshot('01 - Login page opened')
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.attachScreenshot('01 - Login credentials entered')
    await this.loginButton.click();

  }
}

export { LoginPage };
