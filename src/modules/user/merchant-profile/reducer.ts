import { Merchant } from "./types";

export interface MerchanProfileState {
    data: {
        merchant: Merchant;
        isFetching: boolean;
    };
}

const defaultMerchant = {
    email: '',
    level: 0,
    otp: false,
    role: '',
    state: '',
    uid: '',
    profiles: [],
};

export const initialMerchantProfileState: MerchanProfileState = {
    data: {
        merchant: defaultMerchant,
        isFetching: true,
    },
};
export const merchantReducer = (state: MerchanProfileState['data'], action) => {
    switch(action.type) {
        case "MERCHANT_PROFILE_FETCH":
            return {
                ...state,
                isFetching: true
            }
            break;
        case "MERCHANT_PROFILE_SUCCESS":
            return {
                ...state,
                isFetching: false,
                merchant: action.payload.merchant
            }
        default:
            return state;
    }
}


export const merchantProfileReducer = (state = initialMerchantProfileState, action) => {
    switch (action.type) {
        case "MERCHANT_PROFILE_FETCH":
        case "MERCHANT_PROFILE_SUCCESS":
        default:
            return state;
    }
};