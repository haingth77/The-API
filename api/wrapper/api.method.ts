import { BaseApi } from "../base.api";

export class APIMethod extends BaseApi {
    public async GET(endpoint: string, queryParam?: object, headers?: object) {
        console.log("Method: GET")
        console.log("Header: ")
        console.log(headers)

        let response = await this.context.get(endpoint, {
            params: queryParam,
            headers: headers
        })

        console.log("Response url: ", await response.url())
        console.log("Response JSON:")

        try {
            console.log(await response.json())
        } catch (error) {
            console.log(await response.body().toString('utf16le'))
        }

        return await response
    }

    public async POST(endpoint: string, body?: object, headers?: object, file?: object) {
        console.log("Method: POST")
        console.log("Header: ")
        console.log(headers)
        console.log("Request JSON: ")
        console.log(body)

        let multipart = file ? file : undefined
        
        let response = await this.context.post(endpoint, {
            data: body,
            headers: headers,
            multipart: multipart
        })
        console.log("Response url: ", await response.url())
        console.log("Response JSON:")

        try {
            console.log(await response.json())
        } catch (error) {
            console.log(await response.body().toString('utf16le'))
        }

        return await response
    }

    public async PUT(pathParameter: string, body?: object, headers?: object) {
        console.log("Method: PUT")
        console.log("Header: ")
        console.log(headers)
        console.log("Request JSON: ")
        console.log(body)

        let response = await this.context.put(pathParameter, {
            headers: headers,
            data: body
        })
        console.log("Response url: ", await response.url())
        console.log("Response JSON:")

        try {
            console.log(await response.json())
        } catch (error) {
            console.log(await response.body().toString('utf16le'))
        }

        return await response
    }

    public async DELETE(pathParameter: string, headers?: object) {
        console.log("Method: DElETE")
        console.log("Header: ")
        console.log(headers)
  
        let response = await this.context.delete(pathParameter, {
            headers: headers
        })

        console.log("Response url: ", await response.url())
        console.log("Response JSON:")

        try {
            console.log(await response.json())
        } catch (error) {
            console.log(await response.body().toString('utf16le'))
        }

        return await response
    }

} export default new APIMethod()