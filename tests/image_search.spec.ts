import { test } from "@playwright/test"
import SearchImage from "../api/services/search.image"
import verifications, { Verifications } from "../api/utils/verifications"
import utilServices from "../api/utils/util.services"
import { SEARCH_IMAGE } from "../api/utils/enum"
import { ImageSearchSchema } from "../api/schema/image.search.schema"
import { json } from "stream/consumers"

test.describe(`GET: /image/search: Verify endpoint GET: /image/search`, async() => {
    test.skip(`IMGS-000: Verify schema of /image/search`, async() => {
        let response = await SearchImage.getImage()
        let jsonResp = await response.json()

        // Verification
        await verifications.verifyStatusCode(response, 200)
        await verifications.verifyJsonSchema(response, ImageSearchSchema)
    })
    
    test(`IMGS-001: Verify that default apikey get only 1 result`, async () => {
        let response = await SearchImage.getImage()
        let jsonResp = await response.json()

        // Verification
        await verifications.verifyStatusCode(response, 200)
        await verifications.verifyEqualItem(jsonResp.length, 1)   
        
    })

    test(`IMGS-002: Verify that maximum of limit = 100`, async() => {
        //Prepare data
        let limit : number = 100
        let apiKey = await utilServices.getAPIKey()
        let headers : object = { [`x-api-key`] : apiKey }
        let queryParam : object = { limit : limit }

        let response = await SearchImage.getImage_APIKey(queryParam, headers)
        let jsonResp = await response.json()

        // Verification
        await verifications.verifyStatusCode(response, 200)
        await verifications.verifyEqualItem(jsonResp.length, limit)  
    })

    test(`IMGS-003: Verify that return only 100 result although limit = 101`, async() => {
        //Prepare data
        let limit : number = 101
        let apiKey = await utilServices.getAPIKey()
        let headers : object = { [`x-api-key`] : apiKey }
        let queryParam : object = { limit : limit }

        let response = await SearchImage.getImage_APIKey(queryParam, headers)
        let jsonResp = await response.json()

        // Verification
        await verifications.verifyStatusCode(response, 200)
        await verifications.verifyEqualItem(jsonResp.length, SEARCH_IMAGE.MAXIMUM_LIMIT)  
    })

    test(`IMGS-004: Verify that result is sorted when order = ASC`, async() => {
        // Prepare date
        let apiKey = await utilServices.getAPIKey()
        let headers : object = { [`x-api-key`] : apiKey }
        let queryParam : object = { limit : 20 , order : "RANDOM" }

        let response = await SearchImage.getImage_APIKey(queryParam, headers)
        let jsonResp = await response.json()

        let id_result : string[] = []
        await jsonResp.forEach(item => {
            id_result.push(item.id)
        })

        // Verification
        await verifications.verifyStatusCode(response, 200)
        await verifications.verifyEqualItem(jsonResp.length, 20)
        await verifications.verifyElementIsSorted(await id_result)
    })


})

// test(`API`, async({request}) => {
//     const response = await request.get("https://reqres.in/api/users/2")

//     expect(response.status()).toBe(200)
// })