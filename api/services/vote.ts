import apiMethod from "../wrapper/api.method"

export class Vote {

    path = `votes`

    public async getVotes(headers: object, voteId? : number): Promise<any> {
        let response : any
        if (voteId != undefined) {
            response = await apiMethod.GET(this.path + `/${voteId}`, undefined, headers)
        } else {
            response = apiMethod.GET(this.path, undefined , headers)
        } 
        
        return response
    }

    public async createVote(headers: object, requestBody: object) : Promise<any> {
        let response : any = await apiMethod.POST(this.path, requestBody, headers)

        return response
    }

    public async deleteVote(headers: object, voteId: number) : Promise<any> {
        let response : any = await apiMethod.DELETE(this.path + `/${voteId}`, headers)

        return response
    }
} export default new Vote

