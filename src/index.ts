import * as core from '@actions/core';
import {BrOperations} from "./BrOperations";
import {ApiClient} from "./ApiClient";
import {AppConfigFileRole} from "./types";

function initBrOperations(brcStack: string) {
    const config = {
        baseURL: `https://api.${brcStack}.bloomreach.cloud`,
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
        const configFilesAsSystemProperties = core.getInput('configFilesAsSystemProperties', {required: false})

        const brOperations = initBrOperations(brcStack)

        core.info('Start login process');
        const accessToken = await brOperations.login(username, password);
        core.info('Login process finished with success');

        core.info('Start deploying process');
        const envId = await brOperations.getEnvironmentId(envName, accessToken);

        const appConfigFilesNameIdMap = await brOperations.getAppConfigFilesNameIdMap(accessToken);
        core.info(`All BR Cloud config files name/id map = ${Object.entries([...appConfigFilesNameIdMap])}`);

        const appConfigFileRoles: Array<AppConfigFileRole> = getAppConfigFileRoles(configFilesAsSystemProperties, 'systemproperty', appConfigFilesNameIdMap);

        if (!envId) {
            core.setFailed(`Deploy suspended! No environment with name ${envName} has been found.`);
        }

        await brOperations.deploy(distId, envId, appConfigFileRoles, accessToken);
        core.info(`Finished deploying process. Environment ID: ${envId}, DistributionID = ${distId} and Java 'systemproperty' role based AppConfigFileRoles: ${JSON.stringify(appConfigFileRoles)} `);
    } catch (error) {
        core.setFailed(error.message);
    }
}

function getAppConfigFileRoles(configFiles: string, role: string, appConfigFilesNameIdMap: Map<string, string>): Array<AppConfigFileRole> {
    let appConfigFileRoles: Array<AppConfigFileRole> = [];

    if (!configFiles) {
        return appConfigFileRoles;
    }

    for (var file of configFiles.split(/\s*,\s*/)) {
        if (appConfigFilesNameIdMap.has(file)) {
            appConfigFileRoles.push({
                appConfigFileId: appConfigFilesNameIdMap.get(file)!,
                role: role
            });
        } else {
            core.error(`Deploy suspended! Config file ${file} doesn't exists on BR Cloud.`)
        }
    }

    return appConfigFileRoles;
}

deployDistribution()
    .then(() =>  core.info("Finished action"))
    .catch((error) => {
        core.setFailed(error.message);
    })