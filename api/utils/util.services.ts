
export class UtilService {

    public async getAPIKey() {
        let apiKey : string = ''
        apiKey = process.env.apiKey 
        if (apiKey !== null) {
            return apiKey
        } else {
            return "" 
        }
    }

    public async sortArray(arr: any[]) {
        let result : boolean = false
    }

} export default new UtilService()