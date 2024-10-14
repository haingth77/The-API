import test from "@playwright/test"
import { getDataByEnv } from "./utils/environment"
const { request } = require('@playwright/test');

export class BaseApi {
    context: any;
    constructor() {
        test.beforeAll(async ({ }) => {
            this.context = await request.newContext(
                {
                    baseURL: getDataByEnv().url,
                }
            );
        })
    }

}
export default new BaseApi()