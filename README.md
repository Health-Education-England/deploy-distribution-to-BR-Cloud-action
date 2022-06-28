# Deploy distribution to Bloomreach(BR) Cloud action
This action deploys a distribution to BR Cloud using the BR Cloud Rest API. Currently, the action doesn't support copying configuration files though allows configuration files to use as Java system properties.
The API documentation is available at `https://api.<stack-name>.bloomreach.cloud/v3/docs`.

## Inputs

### `brcStack`

**Required** BR Cloud stack name.

### `username`

**Required** BR Cloud username.

### `password`

**Required** BR Cloud password.

### `distId`

**Required** BR Cloud distribution id.

### `envName`

**Required** BR Cloud environment name
### `configFilesAsSystemProperties`

**Optional** BR Cloud comma separated config files as Java system properties [role: "systemproperty"]

## Example usage

```
uses: Health-Education-England/deploy-distribution-to-BR-Cloud-action@v1.0
with:
  brcStack: "brStackName"
  username: ${{ secrets.BRC_USERNAME }}
  password: ${{ secrets.BRC_PASSWORD }}
  distId: "distId"
  envName: "envName"
  configFilesAsSystemProperties: "configFile1,configFile2,..."
```

## Example usage with Health-Education-England/upload-distribution-to-BR-Cloud-action@v1.0
```
...
  steps:
  - name: Upload distribution to Bloomreach Cloud
    id: upload
    uses: Health-Education-England/upload-distribution-to-BR-Cloud-action@v1.0
    with:
      brcStack: "brStackName"
      username: ${{ secrets.BRC_USERNAME }}
      password: ${{ secrets.BRC_PASSWORD }}
      distPath: "${{ github.workspace }}/target/distribution.tar.gz"
  - name: Deploy distribution to Bloomreach Cloud
    uses: Health-Education-England/deploy-distribution-to-BR-Cloud-action@v1.0
    id: deploy
    with:
      brcStack: "brStackName"
      username: ${{ secrets.BRC_USERNAME }}
      password: ${{ secrets.BRC_PASSWORD }}
      distId: ${{ steps.upload.outputs.distId }}
      envName: "envName"
      configFilesAsSystemProperties: "configFile1,configFile2,..."
```
