import { test, expect } from '@playwright/test';
import { UserApi } from '../../pages/UserApi';

const randomString = Math.random().toString(36).substring(2, 10);
const registerData = {
  "fullname": "Test User",
  "email": `test_${randomString}@example.com`,
  "username": `test_${randomString}`,
  "password": "password123"
};

const loginData = {
  "username": registerData.username,
  "password": registerData.password
};

test.describe.serial('User API Tests using POM', () => {
  let token = '';

  test('Register user API Test', async ({request}) => {
    const userApi = new UserApi(request);
    const response = await userApi.register(registerData);
    expect(response.status()).toBe(201);
  });

  test('Get user API Test', async ({request}) => {
    const userApi = new UserApi(request);
    

    const loginResponse = await userApi.login(loginData);
    expect(loginResponse.status()).toBe(200);
    
    const tokenData = await loginResponse.json();
    token = tokenData.data.accessToken; 
   
    const getResponse = await userApi.getCurrentUser(token);
    expect(getResponse.status()).toBe(200);
  });
   
  test('Delete user API Test', async ({request}) => {
    const userApi = new UserApi(request);
    
    const deleteResponse = await userApi.deleteAccount(token);
    expect(deleteResponse.status()).toBe(200);
  });

  test('Logout user API Test', async ({ request }) => {
    
    const userApi = new UserApi(request);
    
    const newRandom = Math.random().toString(36).substring(2, 10);
    await userApi.register({
      "fullname": "Logout Test User",
      "email": `logout_${newRandom}@example.com`,
      "username": `logout_${newRandom}`,
      "password": "password123"
    });

    const loginResponse = await userApi.login({
      "username": `logout_${newRandom}`,
      "password": "password123"
    });
    expect(loginResponse.status()).toBe(200);
    const tokenData = await loginResponse.json();
    const logoutToken = tokenData.data.accessToken;

    const logOutResponse = await userApi.logout(logoutToken);
    expect(logOutResponse.status()).toBe(200);

    const checkResponse = await userApi.getCurrentUser(logoutToken);
    expect(checkResponse.status()).toBe(401);
  });
});