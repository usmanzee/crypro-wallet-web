import { MerchantPayment } from "./types";
import { constants } from "./constants";

export const merchantPaymentsFetch = () => ({
    type: constants.MERCHANT_PAYMENTS_FETCH,
});

export const merchantPaymentsSuccess = (payments: MerchantPayment) => ({
    type: constants.MERCHANT_PAYMENTS_SUCCESS,
    payload: {
        payments: payments
    },
});

export const merchantPaymentsError = (message: String) => ({
    type: constants.MERCHANT_PAYMENTS_ERROR,
    payload: {
        message: message
    },
});