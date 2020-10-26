import { constants } from "./constants";
import { MerchantWebsite } from "./types";

export interface MerchantWebsiteState {
    data: MerchantWebsite;
    isFetching: boolean;
}

const defaultMerchantWebsite = {
    url: '',
    hook: ''
};

export const initialMerchanWebsiteState: MerchantWebsiteState = {
    data: defaultMerchantWebsite,
    isFetching: true
}

export const merchantWebsiteReducer = (state: MerchantWebsiteState = initialMerchanWebsiteState, action) => {
    switch(action.type) {
        case constants.MERCHANT_WEBSITE_FETCH:
            return {
                ...state,
                isFetching: true
            }
        case constants.MERCHANT_WEBSITE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.payload.website
            }
        case constants.MERCHANT_WEBSITE_ERROR:
            return {
                ...state,
                isFetching: false,
                error: action.payload.message
            }
        case constants.MERCHANT_WEBSITE_UPDATE:
            return {
                ...state,
                isUpdating: true
            }
        case constants.MERCHANT_WEBSITE_UPDATE_SUCCESS:
            return {
                ...state,
                isUpdating: false,
                data: action.payload.website
            }
        case constants.MERCHANT_WEBSITE_UPDATE_ERROR:
            return {
                ...state,
                isUpdating: false,
                error: action.payload.message
            }
        default:
            return state;
    }
}