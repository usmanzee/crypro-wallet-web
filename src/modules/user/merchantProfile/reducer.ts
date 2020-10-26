import { constants } from "./constants";
import { MerchantProfile } from "./types";

export interface MerchanProfileState {
    data: MerchantProfile;
    isFetching: boolean;
}

const defaultMerchantProfile = {
    email: '',
    level: 0,
    otp: false,
    role: '',
    state: '',
    uid: '',
    profiles: []
};

export const initialMerchanProfileState: MerchanProfileState = {
    data: defaultMerchantProfile,
    isFetching: true,
};

export const merchantProfileReducer = (state: MerchanProfileState = initialMerchanProfileState, action) => {
    switch(action.type) {
        case constants.MERCHANT_PROFILE_FETCH:
            return {
                ...state,
                isFetching: true
            }
            break;
        case constants.MERCHANT_PROFILE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.payload.profile
            }
        case constants.MERCHANT_PROFILE_ERROR:
            return {
                ...state,
                isFetching: false,
                error: action.payload.message,
            };
        default:
            return state;
    }
}