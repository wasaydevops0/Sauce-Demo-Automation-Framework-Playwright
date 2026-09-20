import { test, expect, request } from '@playwright/test';
import { UserApi } from '../pages/UserApi';

function generateRandomUser(prefix = 'user') {
  const random = Math.random().toString(36).substring(2, 10);
  return {
    fullname: `Test ${prefix}`,
    email: `${prefix}_${random}@example.com`,
    username: `${prefix}_${random}`,
    password: "password123"
  };
}

test.describe('Users API - Comprehensive Tests', () => {
  let mainUser;
  let mainUserToken;
  let api;
  let apiContext;

  test.beforeAll(async () => {
    apiContext = await request.newContext();
    api = new UserApi(apiContext);
    mainUser = generateRandomUser('main');
    
    await api.register(mainUser);
    
    const loginRes = await api.login({ username: mainUser.username, password: mainUser.password });
    const data = await loginRes.json();
    mainUserToken = data.data.accessToken;
  });

  test.afterAll(async () => {
    if (mainUserToken) {
      await api.deleteAccount(mainUserToken);
    }
    await apiContext.dispose();
  });

  test.describe('Register Route', () => {
    test('should successfully register a new user', async ({ request }) => {
      const userApi = new UserApi(request);
      const newUser = generateRandomUser('new');
      
      await test.step('Register the new user', async () => {
        const response = await userApi.register(newUser);
        expect(response.status()).toBe(201);
      });
      
      await test.step('Cleanup the created user', async () => {
        const loginRes = await userApi.login({ username: newUser.username, password: newUser.password });
        const token = (await loginRes.json()).data.accessToken;
        await userApi.deleteAccount(token);
      });
    });

    test('should return 400 for missing fields', async ({ request }) => {
      const userApi = new UserApi(request);
      
      await test.step('Attempt to register user with missing fields', async () => {
        const response = await userApi.register({
          fullname: "Missing Fields"
        });
        expect(response.status()).toBe(400);
      });
    });

    test('should return 409 when user already exists', async ({ request }) => {
      const userApi = new UserApi(request);
      
      await test.step('Attempt to register an already existing user', async () => {
        const response = await userApi.register(mainUser);
        expect(response.status()).toBe(409);
      });
    });
  });

  test.describe('Login Route', () => {
    test('should successfully login a valid user', async ({ request }) => {
      const userApi = new UserApi(request);
      
      await test.step('Login with valid credentials', async () => {
        const response = await userApi.login({ username: mainUser.username, password: mainUser.password });
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.data.accessToken).toBeDefined();
      });
    });

    test('should return 400 for missing password', async ({ request }) => {
      const userApi = new UserApi(request);
      
      await test.step('Login without password', async () => {
        const response = await userApi.login({ username: mainUser.username });
        expect(response.status()).toBe(400);
      });
    });

    test('should return 401 for incorrect password', async ({ request }) => {
      const userApi = new UserApi(request);
      
      await test.step('Login with incorrect password', async () => {
        const response = await userApi.login({ username: mainUser.username, password: 'wrongpassword' });
        expect(response.status()).toBe(401);
      });
    });

    test('should return 404 for non-existent user', async ({ request }) => {
      const userApi = new UserApi(request);
      
      await test.step('Login with non-existent username', async () => {
        const response = await userApi.login({ username: 'nonexistentuser999', password: 'password123' });
        expect(response.status()).toBe(404);
      });
    });
  });

  test.describe('Current User Route', () => {
    test('should fetch current user successfully', async ({ request }) => {
      const userApi = new UserApi(request);
      
      await test.step('Fetch current user data', async () => {
        const response = await userApi.getCurrentUser(mainUserToken);
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.data.username).toBe(mainUser.username);
      });
    });

    test('should return 401 with invalid token', async ({ request }) => {
      const userApi = new UserApi(request);
      
      await test.step('Fetch current user with invalid token', async () => {
        const response = await userApi.getCurrentUser('invalid.token.here');
        expect(response.status()).toBe(401);
      });
    });
  });

  test.describe('Update Account Route', () => {
    test('should successfully update account details', async ({ request }) => {
      const userApi = new UserApi(request);
      const newEmail = `updated_${mainUser.email}`;
      
      await test.step('Update the account details', async () => {
        const response = await userApi.updateAccount({
          fullname: "Updated Name",
          email: newEmail
        }, mainUserToken);
        expect(response.status()).toBe(200);
      });

      await test.step('Verify the updated details', async () => {
        const verifyRes = await userApi.getCurrentUser(mainUserToken);
        const verifyData = await verifyRes.json();
        expect(verifyData.data.fullname).toBe("Updated Name");
        expect(verifyData.data.email).toBe(newEmail);
      });
      
      await test.step('Revert the changes', async () => {
        await userApi.updateAccount({
          fullname: mainUser.fullname,
          email: mainUser.email
        }, mainUserToken);
      });
    });

    test('should return 400 when updating with missing required fields', async ({ request }) => {
      const userApi = new UserApi(request);
      
      await test.step('Update account with missing fields', async () => {
        const response = await userApi.updateAccount({
          fullname: "Only Name"
        }, mainUserToken);
        expect(response.status()).toBe(400);
      });
    });

    test('should return 401 without auth token', async ({ request }) => {
      const userApi = new UserApi(request);
      
      await test.step('Update account with invalid token', async () => {
        const response = await userApi.updateAccount({
          fullname: "Fail Name",
          email: "fail@example.com"
        }, 'invalidtoken');
        expect(response.status()).toBe(401);
      });
    });
  });

  test.describe('Replace Account Route', () => {
    test('should successfully replace account details', async ({ request }) => {
      const userApi = new UserApi(request);
      const tempUser = generateRandomUser('replace');
      let tempToken;
      
      await test.step('Setup temporary user', async () => {
        await userApi.register(tempUser);
        const loginRes = await userApi.login({ username: tempUser.username, password: tempUser.password });
        tempToken = (await loginRes.json()).data.accessToken;
      });

      await test.step('Replace the account details', async () => {
        const response = await userApi.replaceAccount({
          fullname: "Replaced Name",
          email: `replaced_${tempUser.email}`,
          username: `replaced_${tempUser.username}`
        }, tempToken);
        expect(response.status()).toBe(200);
      });

      await test.step('Cleanup temporary user', async () => {
        await userApi.deleteAccount(tempToken);
      });
    });

    test('should return 400 for bad request during replace', async ({ request }) => {
      const userApi = new UserApi(request);
      
      await test.step('Replace account with missing fields', async () => {
        const response = await userApi.replaceAccount({
          fullname: "Missing Username and Email"
        }, mainUserToken);
        expect(response.status()).toBe(400);
      });
    });
  });

  test.describe('Change Password Route', () => {
    test('should successfully change password', async ({ request }) => {
      const userApi = new UserApi(request);
      const tempUser = generateRandomUser('pwd');
      let tempToken;
      
      await test.step('Setup temporary user', async () => {
        await userApi.register(tempUser);
        const loginRes = await userApi.login({ username: tempUser.username, password: tempUser.password });
        tempToken = (await loginRes.json()).data.accessToken;
      });

      await test.step('Change the password', async () => {
        const response = await userApi.changePassword({
          oldPassword: tempUser.password,
          newPassword: "newpassword123"
        }, tempToken);
        expect(response.status()).toBe(200);
      });

      await test.step('Verify the new password', async () => {
        const verifyLogin = await userApi.login({ username: tempUser.username, password: "newpassword123" });
        expect(verifyLogin.status()).toBe(200);
        await userApi.deleteAccount((await verifyLogin.json()).data.accessToken);
      });
    });

    test('should return 400 for incorrect old password', async ({ request }) => {
      const userApi = new UserApi(request);
      
      await test.step('Change password with wrong old password', async () => {
        const response = await userApi.changePassword({
          oldPassword: "wrongoldpassword",
          newPassword: "newpassword123"
        }, mainUserToken);
        expect(response.status()).toBe(400);
      });
    });
  });

  test.describe('Get All Users Route', () => {
    test('should successfully get all users', async ({ request }) => {
      const userApi = new UserApi(request);
      
      await test.step('Fetch all users', async () => {
        const response = await userApi.getAllUsers();
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(Array.isArray(data.data)).toBeTruthy();
      });
    });
  });

  test.describe('Get User By Username Route', () => {
    test('should successfully get user by username', async ({ request }) => {
      const userApi = new UserApi(request);
      
      await test.step('Fetch user by username', async () => {
        const response = await userApi.getUserByUsername(mainUser.username);
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.data.username).toBe(mainUser.username);
      });
    });

    test('should return 200 with null data for non-existent username', async ({ request }) => {
      const userApi = new UserApi(request);
      
      await test.step('Fetch non-existent user by username', async () => {
        const response = await userApi.getUserByUsername('invaliduser9991234');
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.data).toBeNull();
      });
    });
  });

  test.describe('Logout Route', () => {
    test('should successfully logout user', async ({ request }) => {
      const userApi = new UserApi(request);
      const tempUser = generateRandomUser('logout');
      let tempToken;
      
      await test.step('Setup temporary user', async () => {
        await userApi.register(tempUser);
        const loginRes = await userApi.login({ username: tempUser.username, password: tempUser.password });
        tempToken = (await loginRes.json()).data.accessToken;
      });

      await test.step('Logout the user', async () => {
        const response = await userApi.logout(tempToken);
        expect(response.status()).toBe(200);
      });
      
      await test.step('Cleanup temporary user', async () => {
        const reloginRes = await userApi.login({ username: tempUser.username, password: tempUser.password });
        const newToken = (await reloginRes.json()).data.accessToken;
        await userApi.deleteAccount(newToken);
      });
    });

    test('should return 401 when logging out with invalid token', async ({ request }) => {
      const userApi = new UserApi(request);
      
      await test.step('Logout with invalid token', async () => {
        const response = await userApi.logout('invalid.token.here');
        expect(response.status()).toBe(401);
      });
    });
  });

  test.describe('Delete Account Route', () => {
    test('should successfully delete account', async ({ request }) => {
      const userApi = new UserApi(request);
      const tempUser = generateRandomUser('delete');
      let tempToken;
      
      await test.step('Setup temporary user', async () => {
        await userApi.register(tempUser);
        const loginRes = await userApi.login({ username: tempUser.username, password: tempUser.password });
        tempToken = (await loginRes.json()).data.accessToken;
      });

      await test.step('Delete the account', async () => {
        const response = await userApi.deleteAccount(tempToken);
        expect(response.status()).toBe(200);
      });

      await test.step('Verify the account is deleted', async () => {
        const getRes = await userApi.getUserByUsername(tempUser.username);
        expect(getRes.status()).toBe(200);
        const data = await getRes.json();
        expect(data.data).toBeNull();
      });
    });

    test('should return 401 for unauthenticated deletion attempt', async ({ request }) => {
      const userApi = new UserApi(request);
      
      await test.step('Attempt to delete account with invalid token', async () => {
        const response = await userApi.deleteAccount('invalid.token.here');
        expect(response.status()).toBe(401);
      });
    });
  });
});