import { CommonState } from '../../types';
import { PaymentMethodsAction } from './actions';
import {
    PAYMENT_METHODS_FETCH,
    PAYMENT_METHODS_DATA,
    PAYMENT_METHODS_ERROR,
} from './constants';
import { PaymentMethod } from './types';

export interface PaymentMethodsState extends CommonState {
    list: PaymentMethod[];
    loading: boolean;
}

export const initialPaymentMethodsState: PaymentMethodsState = {
    list: [],
    loading: false,
};

export const paymentMethodsReducer = (state = initialPaymentMethodsState, action: PaymentMethodsAction) => {
    switch (action.type) {
        case PAYMENT_METHODS_FETCH:
            return {
                ...state,
                loading: true,
            };
        case PAYMENT_METHODS_DATA:
            return {
                ...state,
                loading: false,
                list: action.payload,
            };
        case PAYMENT_METHODS_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};
