import { test, expect } from '@playwright/test';
import loginData from '../testdata/loginTestData.json';
import homeData from '../testdata/homeTestData.json';
import { LoginPage } from '../pages/LoginPage';

for (const user of loginData.data.validUsers) {
  test(`Standalone dynamic login test for ${user.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await expect(page).toHaveTitle(loginData.data.expectedTitle);

    await loginPage.login(user.username, user.password);

    // await expect(page).toHaveURL(new RegExp('.*' + homeData.data.expectedUrl.split('/').pop()));
    await expect(page).toHaveURL(homeData.data.expectedUrl)
  });
}
