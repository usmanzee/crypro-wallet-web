import { constants } from "./constants";
import { MerchantPayment } from "./types";

export interface MerchantPaymentsState {
    data: MerchantPayment;
    isFetching: boolean;
}

const defaultMerchantProfile = {
    txid: '',
    order_id: '',
    amount: '',
    payment_address: '',
    status: '',
    created_at: '',
    updated_at: '',
};

export const initialMerchanPaymentsState: MerchantPaymentsState = {
    data: defaultMerchantProfile,
    isFetching: true,
};

export const merchantPaymentsReducer = (state: MerchantPaymentsState = initialMerchanPaymentsState, action) => {
    switch(action.type) {
        case constants.MERCHANT_PAYMENTS_FETCH:
            return {
                ...state,
                isFetching: true
            }
            break;
        case constants.MERCHANT_PAYMENTS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.payload.payments
            }
        case constants.MERCHANT_PAYMENTS_ERROR:
            return {
                ...state,
                isFetching: false,
                error: action.payload.message,
            };
        default:
            return state;
    }
}