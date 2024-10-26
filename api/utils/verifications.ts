import { expect } from "@playwright/test"

var Validator = require('jsonschema').Validator


export class Verifications {

    public async verifyStatusCode(response : any, expectedCode: number) {
        console.log(`Verify that status code is: `, expectedCode)
        expect(await response.status()).toEqual(expectedCode)
    }

    public async verifyJsonSchema(response: any, schema: any) {
        console.log(`Verify JsonSchema`)
        let v = await new Validator()
        let result = await v.validate(response, schema).valid

        if (!result) {
            console.log(await v.validate(response, schema).errors)
        }

        expect(await result).toEqual(true)
    }

    public async verifyEqualItem(actual: any, expected: any, item?: string) {
        console.log(item? `Verify that ${item} is equal: ${expected}` : `Verify that is equal: ${expected}`)
        expect(await actual).toEqual(await expected)
    }

    public async verifyNotEqualItem(actual: any, expected: any, item?: string) {
        console.log(item? `Verify that ${item} is not equal: ${expected}` : `Verify that is not equal: ${expected}`)
        expect(await actual).not.toEqual(await expected)
    }

    public async verifyContainItem(actual: any, expected: any, item?: string) {
        console.log(item? `Verify that ${item} contains: ${expected}` : `Verify that item contains: ${expected}`)
        expect(await actual).toContain(await expected)
    }

    public async verifyNotContainItem(actual: any, expected: any, item?: string) {
        console.log(item? `Verify that ${item} not contains: ${expected}` : `Verify that item not contain: ${expected}`)
        expect(await actual).not.toContain(await expected)
    }

    public async verifyItemDefined(actual: any) {
        console.log(`Verify that ${actual} is defined.`)
        expect(await actual).toBeDefined()
    }

    public async verifyItemNotDefined(actual: any) {
        console.log(`Verify that ${actual} is not defined.`)
        expect(await actual).not.toBeDefined()
    }

    public async verifyItemGreaterThan(actual: any, expected: any, item?: string) {

        console.log(item? `Verify that ${item} is greater than: ${expected}` : `Verify Item is greater than: ${expected}`)
        expect(await actual).toBeGreaterThan(await expected)

    }

    public async verifyItemGreaterThanOrEqual(actual: any, expected: any, item?: string) {

        console.log(item? `Verify that ${item} is greater than or equal: ${expected}` : `Verify Item is greater than or equal: ${expected}`)
        expect(await actual).toBeGreaterThanOrEqual(await expected)

    }

    public async verifyItemLessThan(actual: any, expected: any, item?: string) {

        console.log(item? `Verify that ${item} is less than: ${expected}` : `Verify Item is less than: ${expected}`)
        expect(await actual).toBeLessThan(await expected)

    }

    public async verifyItemLessThanOrEqual(actual: any, expected: any, item?: string) {

        console.log(item? `Verify that ${item} is less than or equal: ${expected}` : `Verify Item is less than: ${expected}`)
        expect(await actual).toBeLessThanOrEqual(await expected)

    }

    public async verifyItemInRange(actual: any, expectedLowerBound: any, expectedUpperBound: any, item?: string) {
        
        console.log(item? `Verify that ${item} is in range from ${expectedLowerBound} to ${expectedUpperBound}`: `Verify Item is greater than or equal: ${expectedLowerBound} and less than or equal: ${expectedUpperBound}`)
        expect(await actual).toBeGreaterThanOrEqual(await expectedLowerBound)
        expect(await actual).toBeLessThanOrEqual(await expectedUpperBound)

    }

    public async verifyElementIsSorted (actual: any[]) {
        let result : boolean = false
        console.log(`Verify that is the array sorted: ${actual}`)
        for (let index = 1; index < actual.length; index++) {
            result = actual[index] > actual[index-1]? true : false
            if (result == false) {break}
        }
        expect(await result).toBe(true)
    }


} export default new Verifications()