import ImageSearch from "@services/image.search"
import verifications, { Verifications } from "@utils/verifications"
import utilServices from "@utils/util.services"
import { ImageSearchSchema } from "@schema/image.search.schema"
import { Type_Image } from "@utils/source"
import test from "@playwright/test"

let limit_min : number = 1
let limit_max : number = 100
let limit_equivalent : number = 50
let positiveresponseCode : number = 200
let negativeresponseCode : number = 400

interface DataDriven_Limit {
    id: number;
    request: {
        limit: number | string;
    };
    response: {
        response_code: number;
        response_length: number;
    };
}

interface DataDriven_Order {
    id: number;
    request: {
        order: "ASC" | "DESC" | "RANDOM" | string;
    };
    response: {
        response_code: number;
        response_isOrder: boolean;
    };
}

let dataSet_limit: DataDriven_Limit[] = [
    {
        id: 1,
        request: {
            limit: limit_min -1
        },
        response: {
            response_code: positiveresponseCode,
            response_length: limit_min
        }
    },
    {
        id: 2,
        request: {
            limit: limit_min
        },
        response: {
            response_code: positiveresponseCode,
            response_length: limit_min
        }
    },
    {
        id: 3,
        request: {
            limit: limit_equivalent
        },
        response: {
            response_code: positiveresponseCode,
            response_length: limit_equivalent
        }
    },
    {
        id: 4,
        request: {
            limit: limit_max
        },
        response: {
            response_code: positiveresponseCode,
            response_length: limit_max
        }
    },
    {
        id: 5,
        request: {
            limit: limit_max + 1
        },
        response: {
            response_code: positiveresponseCode,
            response_length: limit_max
        }
    },
    {   id: 6,
        request: {
            limit: "abc"
        },
        response: {
            response_code: positiveresponseCode,
            response_length: limit_min
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
            response_code: positiveresponseCode,
            response_isOrder: false
        }
    },
    {
        id: 2,
        request: {
            order: "ASC"
        },
        response: {
            response_code: positiveresponseCode,
            response_isOrder: true
        }
    },
    {
        id: 3,
        request: {
            order: "DESC"
        },
        response: {
            response_code: positiveresponseCode,
            response_isOrder: true
        }
    },
    {
        id: 4,
        request: {
            order: "abc"
        },
        response: {
            response_code: positiveresponseCode,
            response_isOrder: false
        }
    }
]

let dataSet_pictureType : string[] = [
    "jpg",
    "png",
    "gif",
]

test.describe(`GET: /image/search: Verify endpoint GET: /image/search`, async() => {
    test.skip(`IMGS-000: Verify schema of /image/search`, async() => {
        let response = await ImageSearch.getImage()
        let jsonResp = await response.json()

        // Verification
        await verifications.verifyStatusCode(response, 200)
        await verifications.verifyJsonSchema(response, ImageSearchSchema)
    })
    
    test(`IMGS-001: Verify that default apikey gets only 1 result`, async () => {
        let response = await ImageSearch.getImage()
        let jsonResp = await response.json()

        // Verification
        await verifications.verifyStatusCode(response, 200)
        await verifications.verifyEqualItem(jsonResp.length, 1)     
    })

    test(`IMGS-002: Verify that dummy apikey gets only 1 result`, async() => {
        //Prepare data
        let apiKey = await utilServices.getAPIKey()
        let headers : object = { [`x-api-key`] : "abcdummy" }
        let queryParam : object = { limit : 10 }

        let response = await ImageSearch.getImage_APIKey(headers, queryParam)
        let jsonResp = await response.json()

        // Verification
        await verifications.verifyStatusCode(response, 200)
        await verifications.verifyEqualItem(jsonResp.length, limit_min)  
    })

    test(`IMGS-003: Verify that signed apikey gets maximum 100 results`, async() => {
        //Prepare data
        let headers : object = { [`x-api-key`] : await utilServices.getAPIKey() }
        let queryParam : object = { limit : limit_max }

        let response = await ImageSearch.getImage_APIKey(headers, queryParam)
        let jsonResp = await response.json()

        // Verification
        await verifications.verifyStatusCode(response, 200)
        await verifications.verifyEqualItem(jsonResp.length, limit_max)  
    })

    dataSet_limit.forEach(data => {
        test(`IMGS-limit-${data.id}: Verify that limit = ${data.request.limit} returns ${data.response.response_length} results`, async() => {
            // Prepare data
            let headers : object = { [`x-api-key`] : await utilServices.getAPIKey() }
            let queryParam : object = { limit : data.request.limit }

            let response = await ImageSearch.getImage_APIKey(headers, queryParam)
            let jsonResp = await response.json()

            // Verification
            await verifications.verifyStatusCode(response, data.response.response_code)
            await verifications.verifyEqualItem(jsonResp.length, data.response.response_length)
        })
    })

    dataSet_order.forEach(data => {
        test(`IMGS-order-${data.id}: Verify that order = ${data.request.order} returns ${data.response.response_isOrder ? "sorted" : "not sorted"} results`, async() => {
            // Prepare data
            let headers : object = { [`x-api-key`] : await utilServices.getAPIKey() }
            let queryParam : object = { limit : 20 , order : data.request.order }

            let response = await ImageSearch.getImage_APIKey(headers, queryParam)
            let jsonResp = await response.json()

            let id_result : string[] = []
            jsonResp.forEach(item => {
                id_result.push(item.id)
            })

            console.log(id_result)

            // Verification
            await verifications.verifyStatusCode(response, data.response.response_code)
            await verifications.verifyEqualItem(jsonResp.length, 20)

            let isSorted = (await utilServices.sortArray(id_result, data.request.order) == id_result)? true : false
            console.log(await id_result)
            console.log(await utilServices.sortArray(id_result, data.request.order))
            await verifications.verifyEqualItem(isSorted, data.response.response_isOrder)
        })
    })

    dataSet_pictureType.forEach(data => {
        test(`IMGS-pictureType-${data}: Verify that pictureType = ${data} returns ${data} results`, async() => {
            // Prepare data
            let headers : object = { [`x-api-key`] : await utilServices.getAPIKey() }
            let queryParam : object = { limit : 20 , mime_types : data }

            let response = await ImageSearch.getImage_APIKey(headers, queryParam)
            let jsonResp : Type_Image[] = await response.json()

            let urlList : string[] = []
            jsonResp.forEach(item => {
                urlList.push(item.url)
            })
    
            //Verification
            await verifications.verifyStatusCode(response, 200)
            await verifications.verifyEqualItem(jsonResp.length, 20)

            urlList.forEach( async (url : any) => {
                await verifications.verifyEqualItem(await utilServices.getFileType(url), data, "file type is")
            })
        })
    })
})