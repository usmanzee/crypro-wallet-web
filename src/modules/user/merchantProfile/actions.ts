import { MerchantProfile } from "./types";
import { constants } from "./constants";

export const merchantProfileFetch = () => ({
    type: constants.MERCHANT_PROFILE_FETCH,
});

export const merchantProfileSuccess = (profile: MerchantProfile) => ({
    type: constants.MERCHANT_PROFILE_SUCCESS,
    payload: {
        profile: profile
    },
});

export const merchantProfileError = (message: String) => ({
    type: constants.MERCHANT_PROFILE_ERROR,
    payload: {
        message: message
    },
});