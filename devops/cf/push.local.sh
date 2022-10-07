#!/bin/bash
# This script will push local assets to an environment.
# Usage: ./push.local.sh -v 1.0.0 -d /path/to/build/directory

echo $BASH_VERSION

set -o errexit -euo pipefail -o noclobber -o nounset


####################################################################################
# Create polling function
# Used to check for the status of a PaaS service.
####################################################################################
function cf_poll {
    I=1
    printf "Waiting for $1 backing service...\n"
    while [[ $(cf service $1 | awk -F '  +' '/status:/ {print $2}' | grep 'in progress') ]]
    do
      printf "%0.s-" $(seq 1 $I)
      sleep 2
    done
}

####################################################################################
# Prerequisites - You'll need the following installed
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

# Set required parameters
#    BUILD_DIR - the directory containing the build assets
#    GOVUK_CF_USER (required) - the user deploying the script
#    GOVUK_CF_USER (required) - the user deploying the script
#    GOVUK_CF_PWD (required) - the password for the user account
####################################################################################
OPTIONS=u:p:d:
LONGOPTS=user:,password:,directory:

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
BUILD_DIR=${BUILD_DIR:=$PWD}
GOVUK_CF_USER=${GOVUK_CF_USER:-}
GOVUK_CF_PWD=${GOVUK_CF_PWD:-}

while true; do
    case "$1" in
        -z|--version)
            VERSION="$2"
            shift 2
            ;;
        -d|--directory)
            BUILD_DIR="$2"
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
if [[ -z "${GOVUK_CF_USER}" ]]; then
    echo -n "Enter your Cloud Foundry username: "
    read GOVUK_CF_USER
fi
if [[ -z "${GOVUK_CF_PWD}" ]]; then
    echo -n "Enter your Cloud Foundry password (will be hidden): "
    read -s GOVUK_CF_PWD
fi


####################################################################################
# Login to GovUK PaaS
####################################################################################
printf "Authenticating with GovUK PaaS...\n"

cf login -a api.cloud.service.gov.uk -u $GOVUK_CF_USER -p $GOVUK_CF_PWD -s "primary-authority-register-prototype"
cf target -o "office-for-product-safety-and-standards" -s "primary-authority-register-prototype"


####################################################################################
# Configure the application
# Some values van be set based on the variables provided to this script
# others need to be provided in the form of an app manifest
# To understand manifest configuration see https://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html
####################################################################################
printf "Configuring the application...\n"

MANIFEST="${BASH_SOURCE%/*}/manifests/manifest.prototype.yml"

APP_NAME="beis-par-prototype"


####################################################################################
# Create polling function
# Used to check for the status of a PaaS service.
####################################################################################
function cf_poll {
    I=1
    printf "Waiting for $1 backing service...\n"
    while [[ $(cf service $1 | awk -F '  +' '/status:/ {print $2}' | grep 'in progress') ]]
    do
      printf "%0.s-" $(seq 1 $I)
      sleep 2
    done
    printf "Backing service $1 is running...\n"
}

####################################################################################
# Waiting for cloud foundry to be ready
# If an existing process is already in progress for this environment then wait
# for it's completion before continuing.
####################################################################################
printf "Waiting for cloud foundry (readiness)...\n"

## Checking the app
printf "Waiting for the app...\n"
I=1
while [[ $(cf app $APP_NAME | awk -F '  +' '/status:/ {print $2}' | grep 'in progress') ]]
do
  printf "%0.s-" $(seq 1 $I)
  sleep 2
done


####################################################################################
# Start the app
# And set the environment variables. Even though php will read from the .env file
# setting the cf variables directly allows them to be accessed by other scripts
# see https://docs.cloud.service.gov.uk/deploying_apps.html#deploying-an-app
####################################################################################
printf "Pushing the application...\n"

cf push --no-start -f $MANIFEST -p $BUILD_DIR -n $APP_NAME $APP_NAME


####################################################################################
# Boot the app
####################################################################################
printf "Starting the application...\n"

cf start $APP_NAME

## Run the cache warmer asynchronously with lots of memory
cf run-task $APP_NAME "npm start" -m 2G --name START_APP


####################################################################################
# Run post deployment scripts
####################################################################################
echo "################################################################################################"
echo >&2 "Deployment has been successfully deployed to 'https://$APP_NAME.cloudapps.digital'"
echo "################################################################################################"
