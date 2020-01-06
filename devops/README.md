# Primary Authority Register Prototype - Deployment

The prototype is deployed onto PaaS at the following URL https://beis-par-prototype.cloudapps.digital/

## Start the local environment

To start the local environment run:

```
npm install
npm start
```

## Deploy an updated tag

To deploy a new version of the prototype tag it first using semver:

```
git tag -a v1.0.0
git push origin --tags
```

It is possible to push local code but this ensures there is a record of the version that was deployed.

```
./pull.local.sh --version 'v1.0.0'
```

When this command finishes it will display the following command to be run to push the app, which will look something like.

```
./push.local.sh -d /tmp/beis-primary-authority-register-prototype
```