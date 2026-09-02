import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import checkoutData from '../testdata/checkoutTestData.json';

class CheckoutCompletePage extends BasePage {
  constructor(page) {
    super(page);
    this.completeHeader = page.locator(checkoutData.locators.completeHeader);
    this.backHomeButton = page.locator(checkoutData.locators.backHomeButton);
  }

  async goBackHome() {
    await this.backHomeButton.click();
  }
}

export { CheckoutCompletePage };
