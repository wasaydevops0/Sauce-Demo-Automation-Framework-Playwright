# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\user.spec.js >> Delete user API Test
- Location: tests\api\user.spec.js:36:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 401
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { UserApi } from '../../pages/UserApi';
  3  | 
  4  | const data = {
  5  |   "email": "string",
  6  |   "username": "string",
  7  |   "password": "string"
  8  | }
  9  | 
  10 | const registerData = {
  11 |   "fullname": "new account",
  12 |   "email": "newuser@example.com",
  13 |   "username": "newusername",
  14 |   "password": "newpassword"
  15 | }
  16 | 
  17 | test('Register user API Test', async ({request}) => {
  18 |   const userApi = new UserApi(request);
  19 |   const response = await userApi.register(data);
  20 |   expect(response.status()).toBe(201);
  21 | });
  22 | 
  23 | test('Get user API Test', async ({request}) => {
  24 |   const userApi = new UserApi(request);
  25 |   
  26 |   const loginResponse = await userApi.login(data);
  27 |   expect(loginResponse.status()).toBe(200);
  28 |   
  29 |   const tokenData = await loginResponse.json();
  30 |   const token = tokenData.token;
  31 |  
  32 |   const getResponse = await userApi.getCurrentUser(token);
  33 |   expect(getResponse.status()).toBe(200);
  34 | });
  35 |  
  36 | test('Delete user API Test', async ({request}) => {
  37 |   const userApi = new UserApi(request);
  38 |   
  39 |   const loginResponse = await userApi.login(data);
> 40 |   expect(loginResponse.status()).toBe(200);
     |                                  ^ Error: expect(received).toBe(expected) // Object.is equality
  41 |   
  42 |   const tokenData = await loginResponse.json();
  43 |   const token = tokenData.token;
  44 |  
  45 |   const deleteResponse = await userApi.deleteAccount(token);
  46 |   expect(deleteResponse.status()).toBe(200);
  47 | });
  48 | 
  49 | test('Logout user API Test', async ({ request }) => {
  50 |   const userApi = new UserApi(request);
  51 |   
  52 |   const loginResponse = await userApi.login(data);
  53 |   expect(loginResponse.status()).toBe(200);
  54 |   const tokenData = await loginResponse.json();
  55 |   const token = tokenData.token;
  56 | 
  57 |   const logOutResponse = await userApi.logout(token);
  58 |   expect(logOutResponse.status()).toBe(200);
  59 | 
  60 |   const checkResponse = await userApi.getCurrentUser(token);
  61 |   expect(checkResponse.status()).toBe(401);
  62 | });
```