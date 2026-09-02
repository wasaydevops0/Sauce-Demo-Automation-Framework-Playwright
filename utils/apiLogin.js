import { test, expect } from '@playwright/test';
export default async function apiLogin({request},data){
    const response = await request.post(
    'https://api-testing-postman.vercel.app/api/v1/users/login',
    {
    data: data
    })
 
    return response
 
}