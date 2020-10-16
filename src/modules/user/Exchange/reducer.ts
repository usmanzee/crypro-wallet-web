import { CommonError } from '../../types';
import {
    EXCHANGE_RATE_FETCH,
    EXCHANGE_RATE_SUCCESS,
    EXCHANGE_RATE_ERROR,
    EXCHANGE_FETCH,
    EXCHANGE_SUCCESS,
    EXCHANGE_ERROR,
} from './constants';


export interface ExchangeState {
    isRateFetching: boolean;
    rate: string;
}

export const initialExchangeState: ExchangeState = {
    isRateFetching: false,
    rate: '0.00'
}

export const exchangeReducer = (state: ExchangeState = initialExchangeState, action) => {
    switch(action.type) {
        case EXCHANGE_RATE_FETCH:
            return {
                ...state,
                isRateFetching: true
            }
        case EXCHANGE_RATE_SUCCESS:
            return {
                ...state,
                isRateFetching: false,
                rate: action.payload.rate
            }
        case EXCHANGE_RATE_ERROR:
            return {
                ...state,
                isRateFetching: false,
                rate: '0.00',
                error: action.payload.message
            }
        default:
            return state;
    }
}