import * as core from '@actions/core';
import {BrOperations} from "./BrOperations";
import {ApiClient} from "./ApiClient";

function initBrOperations(brcStack: string) {
    const config = {
        baseURL: `https://api-${brcStack}.onehippo.io`,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        timeout: 1000 * 120,
        timeoutErrorMessage: "Timeout Error! The time limit of 2 minutes was exceeded."
    }

    const apiClient = new ApiClient(config)
    return new BrOperations(apiClient)
}

async function deployDistribution() {
    try {
        const brcStack = core.getInput('brcStack', {required: true})
        const username = core.getInput('username', {required: true})
        const password = core.getInput('password', {required: true})
        const envName = core.getInput('envName', {required: true})
        const distId = core.getInput('distId', {required: true})

        const brOperations = initBrOperations(brcStack)

        core.info('Start login process');
        const accessToken = await brOperations.login(username, password);
        core.info('Login process finished with success');

        core.info('Start deploying process');
        const envId = await brOperations.getEnvironmentId(envName, accessToken);

        if (!envId) {
            core.setFailed(`Deploy suspended! No environment with name ${envName} has been found.`);
        }

        await brOperations.deploy(distId, envId, accessToken);
        core.info(`Finished deploying process. DistributionID = ${distId} Environment ID: ${envId}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

deployDistribution()
    .then(() =>  core.info("Finished action"))
    .catch((error) => {
        core.setFailed(error.message);
    })