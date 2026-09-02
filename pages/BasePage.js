import { test } from '@playwright/test';
import baseData from '../testdata/baseTestData.json';


class BasePage {
  constructor(page) {
    this.page = page;
    this.burgerMenuButton = page.locator(baseData.locators.burgerMenuButton);
    this.logoutLink = page.locator(baseData.locators.logoutLink);
    this.shoppingCartIcon = page.locator(baseData.locators.shoppingCartIcon);
  }

  async attachScreenshot(name) {
    await test.info().attach(name,{
      body: await this.page.screenshot(),
      contentType: 'image/png',
    })
    
  }

  async openSidebar() {
    await this.burgerMenuButton.click();
  }

  async logout() {
    await this.openSidebar();
    await this.logoutLink.click();
  }

  async goToCart() {
    await this.shoppingCartIcon.click();
  }
}

export { BasePage };
