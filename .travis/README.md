# Travis encrypted files

<<<<<<< HEAD
This directory contains a public/private keypair generated just for this repository.

The public key is a deploy key which has been added to the GitHub repo for push access.

The private key is encrypted using `travis encrypt-file` and then committed to this repo.

The decrypt commands are in `.travis.yml`.

To regenerate a key:

```
ssh-keygen -b 4096 -f .travis/govuk_prototype_kit   # Make a new keypair
travis encrypt-file .travis/govuk_prototype_kit     # Encrypt the private key
mv govuk_prototype_kit.enc .travis/                 # Move the private key to the right place
rm .travis/govuk_prototype_kit                      # Remove the unencrypted private key
```
=======
This directory contains an encrypted private deploy key with write access to the
Prototype Kit repository.

It has been encrypted using a key stored in the DEPLOY_KEY environment
variable, which is itself encrypted using `travis encrypt`.

The deploy key is decrypted in create-release.sh.

To update the key:

1. Generate a new keypair using ssh-keygen
   
  ```
  ssh-keygen -b 4096 -f .travis/prototype-kit-deploy-key
  ```

2. Add the *public* key as a new [deploy key], with write access to the
   repository

  ```
  cat .travis/prototype-kit-deploy-key.pub
  ```

2. Generate a new random string which we can use as an encryption key

3. Encrypt the private key using ssh-keygen

  ```
  openssl aes-256-cbc -k [encryption key here] \
    -in prototype-kit-deploy-key \
    -out prototype-kit-deploy-key.enc
  ```

4. Remove the unencrypted private key and the public key

5. Encrypt the private key using the encryption key

  ```
  travis encrypt DEPLOY_KEY=[encryption key]
  ```

6. Add the encrypted variable to the environment variables for the deploy job
   in .travis.yml


[deploy key]: https://github.com/alphagov/govuk-prototype-kit/settings/keys
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
