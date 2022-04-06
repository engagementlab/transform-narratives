import { AzureStorageConfig, azureStorageFile, azureStorageImage } from '@k6-contrib/fields-azure';

if(!process.env.AZURE_STORAGE_ACCOUNT || !process.env.AZURE_STORAGE_ACCESS_KEY || !process.env.AZURE_STORAGE_CONTAINER)
    throw new Error(`Please provide AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_ACCESS_KEY, AZURE_STORAGE_CONTAINER`);

const azConfig: AzureStorageConfig = {
    azureStorageOptions: {
    account: process.env.AZURE_STORAGE_ACCOUNT,
    accessKey: process.env.AZURE_STORAGE_ACCESS_KEY,
    container: process.env.AZURE_STORAGE_CONTAINER,
    },
};
export { azConfig, azureStorageFile };
