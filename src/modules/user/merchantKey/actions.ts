import { MerchantKey } from "./types";
import { constants } from "./constants";

export const merchantKeyFetch = () => ({
    type: constants.MERCHANT_KEY_FETCH,
});

export const merchantKeySuccess = (key: MerchantKey) => ({
    type: constants.MERCHANT_KEY_SUCCESS,
    payload: {
        key: key
    },
});

export const merchantKeyError = (message: String) => ({
    type: constants.MERCHANT_KEY_ERROR,
    payload: {
        message: message
    },
});