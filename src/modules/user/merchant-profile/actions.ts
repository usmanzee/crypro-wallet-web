import { Merchant } from "./types";

export interface MerchantFetch {
    type: "MERCHANT_PROFILE_FETCH";
}

export interface MerchantData {
    type: "MERCHANT_PROFILE_SUCCESS";
    payload: {
        merchant: Merchant;
    };
}

export const merchantFetch = (): MerchantFetch => ({
    type: "MERCHANT_PROFILE_FETCH",
});

export const MerchantSuccess = (payload: MerchantData['payload']): MerchantData => ({
    type: "MERCHANT_PROFILE_SUCCESS",
    payload,
});