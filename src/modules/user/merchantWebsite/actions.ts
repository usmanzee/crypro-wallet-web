import { MerchantWebsite } from "./types";
import { constants } from "./constants";

export const merchantWebsiteFetch = () => ({
    type: constants.MERCHANT_WEBSITE_FETCH,
});

export const merchantWebsiteSuccess = (website: MerchantWebsite) => ({
    type: constants.MERCHANT_WEBSITE_SUCCESS,
    payload: {
        website
    },
});

export const merchantWebsiteError = (message: string) => ({
    type: constants.MERCHANT_WEBSITE_ERROR,
    payload: {
        message
    },
});

export const merchantWebsiteUpdate = (website: MerchantWebsite) => ({
    type: constants.MERCHANT_WEBSITE_UPDATE,
    payload: {
        website
    }
});

export const merchantWebsiteUpdateSuccess = (website: MerchantWebsite) => ({
    type: constants.MERCHANT_WEBSITE_UPDATE_SUCCESS,
    payload: {
        website
    }
});

export const merchantWebsiteUpdateError = (message: string) => ({
    type: constants.MERCHANT_WEBSITE_UPDATE_ERROR,
    payload: {
        message
    }
});