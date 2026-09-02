import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutStepOnePage } from '../../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../../pages/CheckoutCompletePage';
import { BasePage } from '../../pages/BasePage';

import loginData from '../../testdata/loginTestData.json';
import homeData from '../../testdata/homeTestData.json';
import cartData from '../../testdata/cartTestData.json';
import checkoutData from '../../testdata/checkoutTestData.json';

const user = loginData.data.validUsers[0];

test.describe('CheckoutE2E', ()=>{
  for (const checkoutUser of checkoutData.data.checkoutUsers) {
  test(`End-to-End Checkout Flow for ${checkoutUser.firstName} ${checkoutUser.lastName}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOnePage = new CheckoutStepOnePage(page);
    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);

    await test.step('Open login Page', async ()=>{
      await loginPage.goto();
      await loginPage.attachScreenshot('01 - Login page opened')
    })
    
    await test.step('login', async ()=>{
      await loginPage.login(user.username, user.password);
      await loginPage.attachScreenshot('02 - Login')
    })
    
    await test.step('Expecting URL', async ()=>{
      await expect(page).toHaveURL(new RegExp('.*' + homeData.data.expectedUrl.split('/').pop()));
      await loginPage.attachScreenshot('03 - URL assertion successfull')
    })

    await inventoryPage.addToCart(homeData.data.productToSelect);
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(new RegExp('.*' + cartData.data.expectedUrl.split('/').pop()));

    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(new RegExp('.*' + checkoutData.data.stepOneExpectedUrl.split('/').pop()));


    await checkoutStepOnePage.fillInformation(checkoutUser.firstName, checkoutUser.lastName, checkoutUser.postalCode);
    await checkoutStepOnePage.continueCheckout();
    // await expect(page).toHaveURL(new RegExp('.*' + checkoutData.data.stepTwoExpectedUrl.split('/').pop()));
    await expect(page).toHaveURL(checkoutData.data.stepTwoExpectedUrl);
    
    await checkoutStepTwoPage.finishCheckout();
    await expect(page).toHaveURL(new RegExp('.*' + checkoutData.data.completeExpectedUrl.split('/').pop()));


    await expect(checkoutCompletePage.completeHeader).toHaveText(checkoutData.data.completeExpectedMessage);
  });
}

})

//"C:\Program Files\Java"