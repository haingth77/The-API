import { test } from "@playwright/test"
import SearchImage from "../api/services/search.image"
import verifications, { Verifications } from "../api/utils/verifications"
import utilServices from "../api/utils/util.services"
import { SEARCH_IMAGE } from "../api/utils/enum"
import { ImageSearchSchema } from "../api/schema/image.search.schema"
import { json } from "stream/consumers"

let limit_min : number = 1
let limit_max : number = 100
let limit_equivalent : number = 50
let positiveresponseeCode : number = 200
let negativeresponseeCode : number = 400

interface DataDriven_Limit {
    id: number;
    request: {
        limit: number | string;
    };
    response: {
        responsee_code: number;
        responsee_length: number;
    };
}

interface DataDriven_Order {
    id: number;
    request: {
        order: string;
    };
    response: {
        responsee_code: number;
        responsee_isOrder: boolean;
    };
}

let dataSet_limit: DataDriven_Limit[] = [
    {
        id: 1,
        request: {
            limit: limit_min -1
        },
        response: {
            responsee_code: positiveresponseeCode,
            responsee_length: limit_min
        }
    },
    {
        id: 2,
        request: {
            limit: limit_min
        },
        response: {
            responsee_code: positiveresponseeCode,
            responsee_length: limit_min
        }
    },
    {
        id: 3,
        request: {
            limit: limit_equivalent
        },
        response: {
            responsee_code: positiveresponseeCode,
            responsee_length: limit_equivalent
        }
    },
    {
        id: 4,
        request: {
            limit: limit_max
        },
        response: {
            responsee_code: positiveresponseeCode,
            responsee_length: limit_max
        }
    },
    {
        id: 5,
        request: {
            limit: limit_max + 1
        },
        response: {
            responsee_code: positiveresponseeCode,
            responsee_length: limit_max
        }
    },
    {   id: 6,
        request: {
            limit: "abc"
        },
        response: {
            responsee_code: positiveresponseeCode,
            responsee_length: limit_min
        }
    }
]

let dataSet_order: DataDriven_Order[] = [
    {
        id: 1,
        request: {
            order: "RANDOM"
        },
        response: {
            responsee_code: positiveresponseeCode,
            responsee_isOrder: false
        }
    },
    {
        id: 2,
        request: {
            order: "ASC"
        },
        response: {
            responsee_code: positiveresponseeCode,
            responsee_isOrder: true
        }
    },
    {
        id: 3,
        request: {
            order: "DESC"
        },
        response: {
            responsee_code: positiveresponseeCode,
            responsee_isOrder: true
        }
    },
    {
        id: 4,
        request: {
            order: "abc"
        },
        response: {
            responsee_code: positiveresponseeCode,
            responsee_isOrder: false
        }
    }
]
test.describe(`GET: /image/search: Verify endpoint GET: /image/search`, async() => {
    test.skip(`IMGS-000: Verify schema of /image/search`, async() => {
        let responsee = await SearchImage.getImage()
        let jsonResp = await responsee.json()

        // Verification
        await verifications.verifyStatusCode(responsee, 200)
        await verifications.verifyJsonSchema(responsee, ImageSearchSchema)
    })
    
    test(`IMGS-001: Verify that default apikey gets only 1 result`, async () => {
        let responsee = await SearchImage.getImage()
        let jsonResp = await responsee.json()

        // Verification
        await verifications.verifyStatusCode(responsee, 200)
        await verifications.verifyEqualItem(jsonResp.length, 1)     
    })

    test(`IMGS-002: Verify that dummy apikey gets only 1 result`, async() => {
        //Prepare data
        let apiKey = await utilServices.getAPIKey()
        let headers : object = { [`x-api-key`] : "abcdummy" }
        let queryParam : object = { limit : 10 }

        let responsee = await SearchImage.getImage_APIKey(queryParam, headers)
        let jsonResp = await responsee.json()

        // Verification
        await verifications.verifyStatusCode(responsee, 200)
        await verifications.verifyEqualItem(jsonResp.length, limit_min)  
    })

    test(`IMGS-003: Verify that signed apikey gets maximum 100 results`, async() => {
        //Prepare data
        let headers : object = { [`x-api-key`] : await utilServices.getAPIKey() }
        let queryParam : object = { limit : limit_max }

        let responsee = await SearchImage.getImage_APIKey(queryParam, headers)
        let jsonResp = await responsee.json()

        // Verification
        await verifications.verifyStatusCode(responsee, 200)
        await verifications.verifyEqualItem(jsonResp.length, limit_max)  
    })

    dataSet_limit.forEach(data => {
        test(`IMGS-limit-${data.id}: Verify that limit = ${data.request.limit} returns ${data.response.responsee_length} results`, async() => {
            // Prepare data
            let headers : object = { [`x-api-key`] : await utilServices.getAPIKey() }
            let queryParam : object = { limit : data.request.limit }

            let responsee = await SearchImage.getImage_APIKey(queryParam, headers)
            let jsonResp = await responsee.json()

            // Verification
            await verifications.verifyStatusCode(responsee, data.response.responsee_code)
            await verifications.verifyEqualItem(jsonResp.length, data.response.responsee_length)
        })
    })

    dataSet_order.forEach(data => {
        test(`IMGS-order-${data.id}: Verify that order = ${data.request.order} returns ${data.response.responsee_isOrder ? "sorted" : "not sorted"} results`, async() => {
            // Prepare data
            let headers : object = { [`x-api-key`] : await utilServices.getAPIKey() }
            let queryParam : object = { limit : 20 , order : data.request.order }

            let responsee = await SearchImage.getImage_APIKey(queryParam, headers)
            let jsonResp = await responsee.json()

            let id_result : string[] = []
            jsonResp.forEach(item => {
                id_result.push(item.id)
            })

            // Verification
            await verifications.verifyStatusCode(responsee, data.response.responsee_code)
            await verifications.verifyEqualItem(jsonResp.length, 20)
            await verifications.verifyElementIsSorted(id_result, data.request.order)
        })
    })

    // test(`IMGS-004: Verify that result is not sorted when order = RANDOM`, async() => {
    //     // Prepare date
    //     let apiKey = await utilServices.getAPIKey()

    // test(`IMGS-005: Verify that result is sorted when order = ASC`, async() => {
    //     // Prepare date
    //     let apiKey = await utilServices.getAPIKey()
    //     let headers : object = { [`x-api-key`] : apiKey }
    //     let queryParam : object = { limit : 20 , order : "RANDOM" }

    //     let responsee = await SearchImage.getImage_APIKey(queryParam, headers)
    //     let jsonResp = await responsee.json()

    //     let id_result : string[] = []
    //     await jsonResp.forEach(item => {
    //         id_result.push(item.id)
    //     })

    //     // Verification
    //     await verifications.verifyStatusCode(responsee, 200)
    //     await verifications.verifyEqualItem(jsonResp.length, 20)
    //     await verifications.verifyElementIsSorted(id_result, "ASC")
    //})

})