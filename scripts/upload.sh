#!/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games

# Have to re-assign vars from shell env
export AZURE_STORAGE_ACCOUNT=$AZURE_STORAGE_ACCOUNT
export AZURE_STORAGE_CONNECTION_STRING=$AZURE_STORAGE_CONNECTION_STRING

# Upload app build to Azure
az storage blob upload-batch --overwrite true -d '$web' -s ./client/out

# Clear CDN cache
az cdn endpoint purge -g web -n tngvi --content-paths '/*' --profile-name web-apps