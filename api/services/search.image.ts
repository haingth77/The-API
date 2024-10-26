import apiMethod from "../wrapper/api.method"

const max_limit : number = 100

export class SearchImage {

    path = `images/search`

    public async getImage(): Promise<any> {
        let response = await apiMethod.GET(this.path, undefined, undefined)
        
        return await response
    }

    public async getImage_APIKey(queryParam: object, headers: object): Promise<any> {
        let response = await apiMethod.GET(this.path, queryParam, headers)
        
        return await response
    }

} export default new SearchImage