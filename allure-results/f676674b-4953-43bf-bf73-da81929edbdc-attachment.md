# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\user.spec.js >> Logout user API Test
- Location: tests\api\user.spec.js:94:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 401
Received: 200
```

# Test source

```ts
  13  | //   const tokenData = await response.json();
  14  | //   const token = tokenData.token;
  15  |  
  16  | //  const GETResponse = await request.get(
  17  | //     `https://api-testing-postman.vercel.app/api/v1/users/current-user`,
  18  | //     {
  19  | //       headers: {
  20  | //         Authorization: `Bearer ${token}`
  21  | //       }
  22  | //     }
  23  | //   );
  24  | //      console.log(GETResponse.status());
  25  | //   expect(GETResponse.status()).toBe(200);
  26  |  
  27  |  
  28  | // });
  29  |  
  30  |  
  31  |  
  32  |  
  33  | // test('Delete user API Test', async ({request}) => {
  34  | // const response = await apiLogin({request},data)
  35  | // console.log(await response.json());
  36  | // expect(response.status()).toBe(200);
  37  |  
  38  | //   const tokenData = await response.json();
  39  | //   const token = tokenData.token;
  40  |  
  41  | //  const deleteResponse = await request.delete(
  42  | //     `https://api-testing-postman.vercel.app/api/v1/users/delete-account`,
  43  | //     {
  44  | //       headers: {
  45  | //         Authorization: `Bearer ${token}`
  46  | //       }
  47  | //     }
  48  | //   );
  49  | //      console.log(deleteResponse.status());
  50  | //   expect(deleteResponse.status()).toBe(200);
  51  |  
  52  |  
  53  | // });
  54  |  
  55  |  
  56  |  
  57  |  
  58  | // test('Logout user API Test', async ({request, context}) => {
  59  | // const response = await apiLogin({request},data)
  60  |  
  61  | // expect(response.status()).toBe(200);
  62  |  
  63  | //   const tokenData = await response.json();
  64  | //   const token = tokenData.token;
  65  | //   const state = await request.storageState();
  66  | //   expect(state.cookies[0]).toHaveProperty('name');
  67  | //   expect(state.cookies[0]).toHaveProperty('value');
  68  |  
  69  | //   console.log("API Cookies Array:", state.cookies);
  70  |  
  71  | //  const logOutResponse = await request.post(
  72  | //     `https://api-testing-postman.vercel.app/api/v1/users/logout`,
  73  | //     {
  74  | //       headers: {
  75  | //         Authorization: `Bearer ${token}`
  76  | //       }
  77  | //     }
  78  | //   );
  79  | //     await context.clearCookies();
  80  |  
  81  | // const freshCookies = await context.cookies();
  82  |    
  83  |    
  84  | //   expect(logOutResponse.status()).toBe(200);
  85  |  
  86  | // expect(freshCookies.length).toBe(0);
  87  |  
  88  |  
  89  | // });
  90  | 
  91  | 
  92  | 
  93  | 
  94  | test('Logout user API Test', async ({ request }) => {
  95  |   // 1. Login
  96  |   const response = await apiLogin({ request }, data);
  97  |   expect(response.status()).toBe(200);
  98  |   const tokenData = await response.json();
  99  |   const token = tokenData.token;
  100 | 
  101 |   // 2. Logout
  102 |   const logOutResponse = await request.post(
  103 |     `https://api-testing-postman.vercel.app/api/v1/users/logout`, 
  104 |     { headers: { Authorization: `Bearer ${token}` } }
  105 |   );
  106 |   expect(logOutResponse.status()).toBe(200);
  107 | 
  108 |   // 3. Verify token is invalid now
  109 |   const checkResponse = await request.get(
  110 |     `https://vercel.app`, 
  111 |     { headers: { Authorization: `Bearer ${token}` } }
  112 |   );
> 113 |   expect(checkResponse.status()).toBe(401);
      |                                  ^ Error: expect(received).toBe(expected) // Object.is equality
  114 | });
```