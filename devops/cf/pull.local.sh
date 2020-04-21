#!/bin/bash
# This script will push local assets to an environment.
# Usage: ./pull.local.sh -z v28.0.2 -d /tmp/v28 test

echo $BASH_VERSION

set -o errexit -euo pipefail -o noclobber -o nounset

####################################################################################
# Prerequisites - You'll need the following installed
#    AWS CLI - http://docs.aws.amazon.com/cli/latest/userguide/installing.html
#    Cloud Foundry CLI - https://docs.cloudfoundry.org/cf-cli/install-go-cli.html
#    Vault CLI - https://www.vaultproject.io/docs/install/index.html
####################################################################################
! getopt --test > /dev/null
if [[ ${PIPESTATUS[0]} -ne 4 ]]; then
    echo "################################################################################################"
    echo >&2 'Error: `getopt --test` failed in this environment.'
    echo "################################################################################################"

    exit 1
fi

command -v vault >/dev/null 2>&1 || {
    echo "################################################################################################"
    echo >&2 "Please install Vault CLI - https://www.vaultproject.io/docs/install/index.html"
    echo "################################################################################################"
    exit 1
}

command -v aws >/dev/null 2>&1 || {
    echo "################################################################################################"
    echo >&2 "Please install AWS CLI - http://docs.aws.amazon.com/cli/latest/userguide/installing.html"
    echo "If you set it up in a Python virtual env, you may need to run workon"
    echo "################################################################################################"
    exit 1
}

command -v cf >/dev/null 2>&1 || {
    echo "################################################################################################"
    echo >&2 "Please install Cloud Foundry CLI - https://docs.cloudfoundry.org/cf-cli/install-go-cli.html"
    echo "################################################################################################"
    exit 1
}

command -v git >/dev/null 2>&1 || {
    echo "################################################################################################"
    echo >&2 "Please install GIT - https://git-scm.com/book/en/v2/Getting-Started-Installing-Git"
    echo "################################################################################################"
    exit 1
}


####################################################################################
# Set required parameters
#    VERSION (required) - the semver tag to be deployed
#    GOVUK_CF_USER (required) - the user deploying the script
#    GOVUK_CF_USER (required) - the user deploying the script
#    GOVUK_CF_PWD (required) - the password for the user account
####################################################################################
OPTIONS=v:u:p:
LONGOPTS=version:,user:,password:

# -use ! and PIPESTATUS to get exit code with errexit set
# -temporarily store output to be able to check for errors
# -activate quoting/enhanced mode (e.g. by writing out “--options”)
# -pass arguments only via   -- "$@"   to separate them correctly
! PARSED=$(getopt --options=$OPTIONS --longoptions=$LONGOPTS --name "$0" -- "$@")
if [[ ${PIPESTATUS[0]} -ne 0 ]]; then
    # e.g. return value is 1
    #  then getopt has complained about wrong arguments to stdout
    exit 2
fi
# read getopt’s output this way to handle the quoting right:
eval set -- "$PARSED"

# Defaults
VERSION=${VERSION:-}
GOVUK_CF_USER=${GOVUK_CF_USER:-}
GOVUK_CF_PWD=${GOVUK_CF_PWD:-}

while true; do
    case "$1" in
        -z|--version)
            VERSION="$2"
            shift 2
            ;;
        -u|--user)
            GOVUK_CF_USER="$2"
            shift 2
            ;;
        -p|--password)
            GOVUK_CF_PWD="$2"
            shift 2
            ;;
        --)
            shift
            break
            ;;
        *)
            echo "Programming error"
            exit 3
            ;;
    esac
done


####################################################################################
# Allow manual input of missing parameters
#    ENV (required) - the password for the user account
#    GOVUK_CF_USER (required) - the user deploying the script
#    GOVUK_CF_PWD (required) - the password for the user account
#    BUILD_DIR - the directory containing the build assets
#    VAULT_ADDR - the vault service endpoint
#    VAULT_UNSEAL_KEY (required) - the key used to unseal the vault
####################################################################################
if [[ -z "${VERSION}" ]]; then
    echo -n "Enter the tag you wish to deploy: "
    read VERSION
fi
if [[ -z "${GOVUK_CF_USER}" ]]; then
    echo -n "Enter your Cloud Foundry username: "
    read GOVUK_CF_USER
fi
if [[ -z "${GOVUK_CF_PWD}" ]]; then
    echo -n "Enter your Cloud Foundry password (will be hidden): "
    read -s GOVUK_CF_PWD
fi


####################################################################################
# Git the required git tag
####################################################################################
printf "Pulling version $VERSION...\n"

printf "Downloading build 'git checkout tags/$VERSION'...\n"

cd /tmp
rm -fr ./beis-primary-authority-register-prototype

REPO="https://github.com/UKGovernmentBEIS/beis-primary-authority-register-prototype.git"
git ls-remote --tags $REPO | grep -E "refs/(heads|tags)/${VERSION}$"


if [[ $? -eq 0 ]]; then
    printf "Retrieving tag '$VERSION'...\n"

    git clone $REPO --branch $VERSION --depth 1 --single-branch

    cd ./beis-primary-authority-register-prototype && npm install

    SCRIPT="${BASH_SOURCE%/*}/push.local.sh -d /tmp/beis-primary-authority-register-prototype"

    printf "Tag '$VERSION' has been retrieved...\n"
    printf "Please deploy this to an environment using the following command...\n"
    printf "$SCRIPT\n"

else
    printf "The tag '$VERSION' does not exist...\n"
fi
