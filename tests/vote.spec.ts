import test from "@playwright/test";
import { Type_Vote } from "@utils/source";
import Vote from "@services/vote";
import verifications from "@utils/verifications";
import utilServices from "@utils/util.services";

interface DataDriven_Vote {
    id: number;
    test_field: string;
    request: {
        image_id?: string;
        sub_id?: string;
        value?: number;
    };
}

let dataSet_votes: DataDriven_Vote[] = [
    {
        id: 1,
        test_field: "image_id",
        request: {
            sub_id: "VOTE-003-lackof image_id",
            value: 3
        },
    },
    {
        id: 2,
        test_field: "sub-id",
        request: {
            image_id: "VOTE-003-LACKOF-sub_id",
            value: 4
        }
    },
    {
        id: 3,
        test_field: "value",
        request: {
            image_id: "VOTE-003",
            sub_id: "VOTE-003-sub-lackof-value",
        }
    }
]

test.describe(`VOTE: Verify that the vote is successful`, async() => {
    test(`VOTE-001: Verify that cannot get voted without a valid API key`, async() => {
        // Prepare data
        let headers : object = {}
        let response = await Vote.getVotes(headers)

        let textResp = await response.text()

        // Verification
        await verifications.verifyStatusCode(response, 401)
        await verifications.verifyEqualItem(textResp, "AUTHENTICATION_ERROR - you need to send your API Key as the 'x-api-key' header", "message")
    })

    test(`VOTE-002: Verify that cannot get a vote which is note created by the API key`, async() => {
        // Prepare data
        let headers : object = { [`x-api-key`]: await utilServices.getAPIKey() }
        let response = await Vote.getVotes(headers, 111111111)

        let textResp = await response.text()

        // Verification
        await verifications.verifyStatusCode(response, 404)
        await verifications.verifyEqualItem(textResp, "NOT_FOUND", "message")
    })

    test(`VOTE-003: Verify that cannot create a vote without a valid API key`, async() => {
        // Prepare data
        let headers : object = {}
        let requestBody : any = {
            image_id: "VOTE-001",
            sub_id: "VOTE-001-sub",
            value: 1
        }

        let response = await Vote.createVote(headers, requestBody)
        let textResp = await response.text()

        // Verification
        await verifications.verifyStatusCode(response, 401)
        await verifications.verifyEqualItem(textResp, "AUTHENTICATION_ERROR", "message")
    })

    test(`VOTE-004: Verify that full flow from creating to deleting and getting after deleting vote`, async() => {
        // Prepare data
        let headers : object = { [`x-api-key`]: await utilServices.getAPIKey() }
        let requestBody : Type_Vote = {
            image_id: "VOTE-002",
            sub_id: "VOTE-002-sub",
            value: 2
        }

        let response = await Vote.createVote(headers, requestBody)
        let jsonResp = await response.json()

        // Verification
        await verifications.verifyStatusCode(response, 201)
        await verifications.verifyEqualItem(jsonResp.image_id, "VOTE-002", "image_id")
        await verifications.verifyEqualItem(jsonResp.sub_id, "VOTE-002-sub", "sub_id")
        await verifications.verifyEqualItem(jsonResp.value, 2, "value")

        // Get vote id
        let responseGet = await Vote.getVotes(headers, jsonResp.id)
        let jsonRespGet = await responseGet.json()

        // Verification
        await verifications.verifyStatusCode(responseGet, 200)
        await verifications.verifyEqualItem(jsonRespGet.image_id, "VOTE-002", "image_id")
        await verifications.verifyEqualItem(jsonRespGet.sub_id, "VOTE-002-sub", "sub_id")
        await verifications.verifyEqualItem(jsonRespGet.value, 2, "value")

        // Delete vote
        let responseDelete = await Vote.deleteVote(headers, jsonResp.id)
        let jsonRespDelete = await responseDelete.json()

        // Verification
        await verifications.verifyStatusCode(responseDelete, 200)
        await verifications.verifyContainItem(jsonRespDelete.message, "SUCCESS", "message")

        let responseGetAfterDelete = await Vote.getVotes(headers, jsonResp.id)
        let textRespGetAfterDelete = await responseGetAfterDelete.text()

        // Verification
        await verifications.verifyStatusCode(responseGetAfterDelete, 404)   
        await verifications.verifyContainItem(textRespGetAfterDelete, "NOT_FOUND", "message")     
    })

    dataSet_votes.forEach(data => {
        test(`VOTE-005-${data.id}: Verify that ${data.test_field} is required`, async() => {
            // Prepare data
            let headers : object = { [`x-api-key`]: await utilServices.getAPIKey() }
            let response = await Vote.createVote(headers, data.request)

            let jsonResp = await response.text()

            // Verification
            await verifications.verifyStatusCode(response, 400)
            await verifications.verifyContainItem(jsonResp, `"${data.test_field}" is required`, "message")
        })
    })

    test(`VOTE-006: Verify that cannot delete a vote which is not created by the API key`, async() => {
        // Prepare data
        let headers : object = { [`x-api-key`]: await utilServices.getAPIKey() }
        let response = await Vote.deleteVote(headers, 111111111)

        let textResp = await response.text()

        // Verification
        await verifications.verifyStatusCode(response, 404)
        await verifications.verifyEqualItem(textResp, "INVALID_ACCOUNT", "message")
    })
})