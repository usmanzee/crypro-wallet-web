import { constants } from "./constants";
import { MerchantKey } from "./types";

export interface MerchantKeyState {
    data: MerchantKey;
    isFetching: boolean;
}

const defaultMerchantKey = {
    key: ''
};

export const initialMerchanKeyState: MerchantKeyState = {
    data: defaultMerchantKey,
    isFetching: true
}

export const merchantKeyReducer = (state: MerchantKeyState = initialMerchanKeyState, action) => {
    switch(action.type) {
        case constants.MERCHANT_KEY_FETCH:
            return {
                ...state,
                isFetching: true
            }
        case constants.MERCHANT_KEY_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.payload.key
            }
        case constants.MERCHANT_KEY_ERROR:
            return {
                ...state,
                isFetching: false,
                error: action.payload.message
            }
        default:
            return state;
    }
}