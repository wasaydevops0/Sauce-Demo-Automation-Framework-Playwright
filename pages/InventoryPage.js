import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import homeData from '../testdata/homeTestData.json';

class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.title = page.locator(homeData.locators.title);
  }

  async addToCart(productNameId) {
    await this.page.locator(`${homeData.locators.addToCartPrefix}${productNameId}${homeData.locators.addToCartSuffix}`).click();
  }
}

export { InventoryPage };
