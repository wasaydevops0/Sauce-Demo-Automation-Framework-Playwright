const { test, expect } = require('@playwright/test');

test('Intentional Failure Test', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  // Intentionally expect the title to be something incorrect to trigger a failure
  await expect(page).toHaveTitle('Swag Labs');
});
