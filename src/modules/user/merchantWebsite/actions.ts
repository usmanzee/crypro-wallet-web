import { MerchantWebsite } from "./types";
import { constants } from "./constants";

export const merchantWebsiteFetch = () => ({
    type: constants.MERCHANT_WEBSITE_FETCH,
});

export const merchantWebsiteSuccess = (website: MerchantWebsite) => ({
    type: constants.MERCHANT_WEBSITE_SUCCESS,
    payload: {
        website: website
    },
});

export const merchantWebsiteError = (message: String) => ({
    type: constants.MERCHANT_WEBSITE_ERROR,
    payload: {
        message: message
    },
});

export const merchantWebsiteUpdate = (merchantWebsiteData: MerchantWebsite) => ({
    type: constants.MERCHANT_WEBSITE_UPDATE,
    payload: {
        merchantWebsiteData: merchantWebsiteData
    }
});