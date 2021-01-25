# Deploy distribution to Bloomreach(BR) Cloud action
This action deploys a distribution to BR Cloud using the BR Cloud Rest API. 
The API documentation is available at `https://api-<stack-name>.onehippo.io/v3/docs`. 

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

## Example usage

```
uses: adrianamiclos/deploy-distribution-to-BRCloud-action@v1.0
with:
  brcStack: "brStackName"
  username: ${{ secrets.BRC_USERNAME }}
  password: ${{ secrets.BRC_PASSWORD }}
  distId: "distId"
  envName: "envName"
```

## Example usage with adrianamiclos/upload-distribution-to-BRCloud-action@v1.0
```
...
  steps:
  - name: Upload distribution to Bloomreach Cloud
    id: upload
    uses: adrianamiclos/upload-distribution-to-BRCloud-action@v1.0
    with:
      brcStack: "brStackName"
      username: ${{ secrets.BRC_USERNAME }}
      password: ${{ secrets.BRC_PASSWORD }}
      distPath: "${{ github.workspace }}/target/distribution.tar.gz"
  - name: Deploy distribution to Bloomreach Cloud
    uses: adrianamiclos/deploy-distribution-to-BRCloud-action@v1.0
    id: deploy
    with:
      brcStack: "brStackName"
      username: ${{ secrets.BRC_USERNAME }}
      password: ${{ secrets.BRC_PASSWORD }}
      distId: ${{ steps.upload.outputs.distId }}
      envName: "envName"

```