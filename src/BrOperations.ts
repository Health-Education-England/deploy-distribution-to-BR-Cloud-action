import {ApiClient} from "./ApiClient";

export class BrOperations {
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient
    }

    async login(username: string, password: string): Promise<string> {
        console.log('Retrieve BRC access token.');
        const authURL = '/v3/authn/access_token';

        const response = await this.apiClient.post(
            authURL,
            {
                username,
                password,
            },
        );
        console.log('Received access token');

        const authResponse = response.data;
        return `Bearer ${authResponse.access_token}`
    }

    async deploy(distId: string, environmentId: string, accessToken: string): Promise<void> {
        console.log('Deploy distribution to BRC.');

        const body = {
            distributionId: distId,
            strategy: 'stopstart',
        };

        await this.apiClient.put(
            `/v3/environments/${environmentId}/deploy`,
            body,
            {
                headers: {
                    Authorization: accessToken,
                },
            },
        );

        console.log('Deploy request completed.');
    }

    async getEnvironmentId(environmentName: string, accessToken: string): Promise<string> {
        console.log('Get environment id.');

        const response = await this.apiClient.get(
            '/v3/environments?name=' + environmentName,
            {
                headers: {
                    Authorization: accessToken,
                }
            }
        );
        console.log('Received environment id.');

        return response.data.id;
    }
}