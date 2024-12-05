
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

    public async sortArray(arr: any[], order: "ASC" | "DESC" | "RANDOM" | string) : Promise<any[]>{
        if (order == "ASC") {
            return arr.sort((a, b) => a - b)
        } else if (order == "DESC") {
            return arr.sort((a, b) => b - a)
        } else {
            return []
        }
    }

    public async getFileType(file: string) : Promise<string> {
        let temp : string[] = file.split('.')

        return temp[temp.length -1]
    }

} export default new UtilService()