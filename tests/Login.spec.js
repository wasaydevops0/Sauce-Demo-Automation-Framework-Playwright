import { test, expect } from '@playwright/test';
import loginData from '../testdata/loginTestData.json';
import homeData from '../testdata/homeTestData.json';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Login',()=>{
  for (const { username, password } of loginData.data.validUsers) {
  test(`Login with credentials - ${username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await test.step('Open login page', async()=>{
      await loginPage.goto();
    })
    await expect(page).toHaveTitle(loginData.data.expectedTitle);

    await loginPage.login(username, password);

    await expect(page).toHaveURL(homeData.data.expectedUrl);
    await expect(inventoryPage.title).toHaveText(homeData.data.expectedTitleText);
  });
}
})