import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import checkoutData from '../testdata/checkoutTestData.json';

class CheckoutStepOnePage extends BasePage {
  constructor(page) {
    super(page);
    this.firstNameInput = page.locator(checkoutData.locators.firstNameInput);
    this.lastNameInput = page.locator(checkoutData.locators.lastNameInput);
    this.postalCodeInput = page.locator(checkoutData.locators.postalCodeInput);
    this.continueButton = page.locator(checkoutData.locators.continueButton);
  }

  async fillInformation(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueCheckout() {
    await this.continueButton.click();
  }
}

export { CheckoutStepOnePage };
