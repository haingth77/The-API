import { test, expect } from "@playwright/test"
import apiMethod from "../api/wrapper/api.method"

test.describe(`GET: /image/search: Verify endpoint GET: /image/search`, async() => {
    test(`IMGS-001: Verify that default apikey only get 1 result`, async() => {
        let response = await apiMethod.GET("images/search?limit=20")

        expect(response.status()).toBe(200)
    })
})

// test(`API`, async({request}) => {
//     const response = await request.get("https://reqres.in/api/users/2")

//     expect(response.status()).toBe(200)
// })