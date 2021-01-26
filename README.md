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
uses: Manifesto-Digital/deploy-distribution-to-BR-Cloud-action@v1.0
with:
  brcStack: "brStackName"
  username: ${{ secrets.BRC_USERNAME }}
  password: ${{ secrets.BRC_PASSWORD }}
  distId: "distId"
  envName: "envName"
```

## Example usage with Manifesto-Digital/upload-distribution-to-BR-Cloud-action@v1.0
```
...
  steps:
  - name: Upload distribution to Bloomreach Cloud
    id: upload
    uses: Manifesto-Digital/upload-distribution-to-BR-Cloud-action@v1.0
    with:
      brcStack: "brStackName"
      username: ${{ secrets.BRC_USERNAME }}
      password: ${{ secrets.BRC_PASSWORD }}
      distPath: "${{ github.workspace }}/target/distribution.tar.gz"
  - name: Deploy distribution to Bloomreach Cloud
    uses: Manifesto-Digital/deploy-distribution-to-BR-Cloud-action@v1.0
    id: deploy
    with:
      brcStack: "brStackName"
      username: ${{ secrets.BRC_USERNAME }}
      password: ${{ secrets.BRC_PASSWORD }}
      distId: ${{ steps.upload.outputs.distId }}
      envName: "envName"

```