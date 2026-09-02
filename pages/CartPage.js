import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import cartData from '../testdata/cartTestData.json';

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.checkoutButton = page.locator(cartData.locators.checkoutButton);
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}

export { CartPage };
