import { BasePage } from './BasePage';
import checkoutData from '../testdata/checkoutTestData.json';

class CheckoutStepTwoPage extends BasePage {
  constructor(page) {
    super(page);
    this.finishButton = page.locator(checkoutData.locators.finishButton);
  }

  async finishCheckout() {
    await this.finishButton.click();
  }
}

export { CheckoutStepTwoPage };
