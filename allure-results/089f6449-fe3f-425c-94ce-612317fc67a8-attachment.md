# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\user.spec.js >> User API Tests using POM >> Logout user API Test
- Location: tests\api\user.spec.js:47:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 401
Received: 200
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { UserApi } from '../../pages/UserApi';
  3  | 
  4  | const randomString = Math.random().toString(36).substring(2, 10);
  5  | const registerData = {
  6  |   "fullname": "Test User",
  7  |   "email": `test_${randomString}@example.com`,
  8  |   "username": `test_${randomString}`,
  9  |   "password": "password123"
  10 | };
  11 | 
  12 | const loginData = {
  13 |   "username": registerData.username,
  14 |   "password": registerData.password
  15 | };
  16 | 
  17 | test.describe.serial('User API Tests using POM', () => {
  18 |   let token = '';
  19 | 
  20 |   test('Register user API Test', async ({request}) => {
  21 |     const userApi = new UserApi(request);
  22 |     const response = await userApi.register(registerData);
  23 |     expect(response.status()).toBe(201);
  24 |   });
  25 | 
  26 |   test('Get user API Test', async ({request}) => {
  27 |     const userApi = new UserApi(request);
  28 |     
  29 |     // Login to get the token
  30 |     const loginResponse = await userApi.login(loginData);
  31 |     expect(loginResponse.status()).toBe(200);
  32 |     
  33 |     const tokenData = await loginResponse.json();
  34 |     token = tokenData.data.accessToken; // Save token for subsequent tests
  35 |    
  36 |     const getResponse = await userApi.getCurrentUser(token);
  37 |     expect(getResponse.status()).toBe(200);
  38 |   });
  39 |    
  40 |   test('Delete user API Test', async ({request}) => {
  41 |     const userApi = new UserApi(request);
  42 |     
  43 |     const deleteResponse = await userApi.deleteAccount(token);
  44 |     expect(deleteResponse.status()).toBe(200);
  45 |   });
  46 | 
  47 |   test('Logout user API Test', async ({ request }) => {
  48 |     // To logout successfully, we need an active account, so we'll register and login again
  49 |     // since we just deleted the account in the previous step.
  50 |     const userApi = new UserApi(request);
  51 |     
  52 |     const newRandom = Math.random().toString(36).substring(2, 10);
  53 |     await userApi.register({
  54 |       "fullname": "Logout Test User",
  55 |       "email": `logout_${newRandom}@example.com`,
  56 |       "username": `logout_${newRandom}`,
  57 |       "password": "password123"
  58 |     });
  59 | 
  60 |     const loginResponse = await userApi.login({
  61 |       "username": `logout_${newRandom}`,
  62 |       "password": "password123"
  63 |     });
  64 |     expect(loginResponse.status()).toBe(200);
  65 |     const tokenData = await loginResponse.json();
  66 |     const logoutToken = tokenData.data.accessToken;
  67 | 
  68 |     const logOutResponse = await userApi.logout(logoutToken);
  69 |     expect(logOutResponse.status()).toBe(200);
  70 | 
  71 |     const checkResponse = await userApi.getCurrentUser(logoutToken);
> 72 |     expect(checkResponse.status()).toBe(401);
     |                                    ^ Error: expect(received).toBe(expected) // Object.is equality
  73 |   });
  74 | });
```