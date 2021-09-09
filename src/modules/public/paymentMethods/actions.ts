import {
    PAYMENT_METHODS_FETCH,
    PAYMENT_METHODS_DATA,
    PAYMENT_METHODS_ERROR,
} from './constants';
import { PaymentMethod } from './types';

export interface PaymentMethodsFetch {
    type: typeof PAYMENT_METHODS_FETCH;
}

export interface PaymentMethodsData {
    type: typeof PAYMENT_METHODS_DATA;
    payload: PaymentMethod[];
}

export interface PaymentMethodsError {
    type: typeof PAYMENT_METHODS_ERROR;
}

export type PaymentMethodsAction =
    PaymentMethodsFetch
    | PaymentMethodsData
    | PaymentMethodsError;

export const paymentMethodsFetch = (): PaymentMethodsFetch => ({
    type: PAYMENT_METHODS_FETCH,
});

export const paymentMethodsData = (payload: PaymentMethodsData['payload']): PaymentMethodsData => ({
    type: PAYMENT_METHODS_DATA,
    payload,
});

export const paymentMethodsError = (): PaymentMethodsError => ({
    type: PAYMENT_METHODS_ERROR,
});
